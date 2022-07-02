package de.heidegger.phillip.chat.server;

import de.heidegger.phillip.chat.commands.Command;
import de.heidegger.phillip.chat.commands.NoAuthCheck;
import de.heidegger.phillip.chat.commands.roomCommands.LeaveRoom;
import de.heidegger.phillip.chat.commands.userCommands.Logout;
import de.heidegger.phillip.chat.events.userEvents.*;
import de.heidegger.phillip.chat.views.ChatServerRoomView;
import de.heidegger.phillip.chat.views.ChatServerUserView;
import de.heidegger.phillip.chat.views.EventView;
import de.heidegger.phillip.utils.EMail;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicLong;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;
import java.util.logging.StreamHandler;

public class ChatServer {
//    private static final Class<?>[] userCommands = {RegisterUser.class, RenameUser.class,
//            ChangeUserPassword.class};
//    private static final Class<?>[] loginCommands = {Login.class, Logout.class};
//    private static final Class<?>[] roomCommands = {JoinRoom.class, LeaveRoom.class,
//            SendMessageToRoom.class, SetInviteRoom.class, SetVoiceRoom.class,
//            GrantOp.class, GrantVoice.class, InviteToRoom.class};
//    private static final Class<?>[][] allCommands = { userCommands, loginCommands, roomCommands };

    private static final Logger logger = Logger.getLogger(ChatServer.class.getSimpleName());
    static {
        logger.addHandler(new StreamHandler(System.out, new SimpleFormatter()));
    }
    private static final Path userFile = Paths.get("users.json");
    private static AtomicLong nextFreeClientId = new AtomicLong();

    // contains all users known to the system with their mail, name and sha1PasswordHash
    private final ChatServerUserView chatServerUserView = new ChatServerUserView(userFile);

    // Do not remove the lambda expression here. It is used to solve the cyclic initialisation
    // dependency between the manager and the view
    private final ChatServerRoomView chatServerRoomView = new ChatServerRoomView(e -> this.manager.spread(e),
            chatServerUserView);
    private final EventView userViewSaver = event -> {
        if (event instanceof UserRegistered || event instanceof UserRenamed || event instanceof
                ChangedUserPassword) {
            System.out.println("Save users to file");
            chatServerUserView.save(ChatServer.userFile);
        }
    };

    // contains the currently connected users. These instances also contain the WebSocket
    // objects, so that we can deliver events to them.
    private final Map<Long, ChatClient> clients = new ConcurrentHashMap<>();

    /* This contains a list of views created based on the events that were emitted.
     * Most events have a command as an origin, e.g. a client is sending a command
     * to the server. Task of a view is to take events and build data structures out
     * of them to represent the current state of affairs with respect to the focus of the
     * view.
     * */
    private final List<EventView> views = new ArrayList<>();
    private ExecutorService executorService = Executors.newSingleThreadExecutor();

    private final ChatServerTrustedAPI manager =
            new MyChatServerManager(logger, views, executorService, chatServerUserView, chatServerRoomView);

    public ChatServer() {
        this.views.add(chatServerUserView);
        this.views.add(chatServerRoomView);
        this.views.add(userViewSaver);
    }

    public ChatClient createClientInstance() {
        long nextFreeId = nextFreeClientId.getAndIncrement();
        ChatClient chatClient = new ChatClient(this, nextFreeId);
        this.views.add(new ChatClientEventFilter(chatClient, chatServerRoomView));
        this.clients.put(nextFreeId, chatClient);
        logger.log(Level.INFO, "Create client instance with id: " + chatClient.getId());
        return chatClient;
    }

    public void destroyClientInstance(ChatClient chatClient) {
        logger.log(Level.INFO, "Mark client as dead, WebSocket is closed." + chatClient.getId());
        // Remove first, because the session is already removed from the object
        // Hence, we cannot send stuff to the client anymore.
        executorService.submit(() -> {
            logger.log(Level.INFO, "Remove client from Server, WebSocket is closed." + chatClient.getId());
            this.views.remove(new ChatClientEventFilter(chatClient, chatServerRoomView));
            this.clients.remove(chatClient.getId());

            if (chatClient.isAuthenticated()) {
                new Logout().execute(chatClient, manager);
            }
        });
    }

    /**
     * Processes the command by checking if the user has the permissions
     * to perform it. If the user has, an event is generated to protocol
     * the command was performed. Also, the side effects are executed.
     *
     * The implementation of this method delegates the commands to methods that
     * take care of the different kind of commands.
     *
     * @param clientId The id of the client that wants to execute the command.
     * @param clientCommand The command itself.
     * @return If the command was rejected, false is returned.
     *         If the command is executed, true is returned.
     */
    public boolean handleClientCommands(long clientId, Object clientCommand) {
        return clientCommand instanceof Command
            && handleClientCommands(clientId, (Command) clientCommand);
    }

    public void log(Level level, String msg, Throwable t) {
        logger.log(level, msg, t);
    }

    public void log(Level level, String s) {
        logger.log(level, s);
    }

    void logout(ChatClient chatClient) {
        // 1. read out identification data from client
        long id = chatClient.getId();
        EMail email = chatClient.getEmail();

        // 2. Check, if this was the last online session of the user. If so, leave rooms
        ChatClientUserData chatClientUserData = chatServerUserView.getUser(email);
        if (this.clients.values().stream()
                .filter(client -> email.equals(client.getEmail())).count() < 2) {
            // Client is disconnected from the other objects. Now, let them know that the client left.
            chatServerRoomView.leaveAllRooms(chatClientUserData).forEach(roomName -> {
                new LeaveRoom(roomName).execute(chatClient, manager);
            });
        }

        // 3. Next, spread the logout event to inform everybody about the logout itself.
        LoggedOut loggedOut = new LoggedOut(id, email);
        manager.spread(loggedOut);

        // 4. Finally, clean client, so that it does not contribute anymore to the number
        //  of logged in session in a room, etc.
        chatClient.demote();

    }

    private boolean handleClientCommands(long clientId, Command command) {
        if (clients.containsKey(clientId)) {
            ChatClient client = clients.get(clientId);
            if (handleCommands(client, command))
                return true;
        }
        return false;
    }

    private boolean handleCommands(ChatClient client, Command command) {
        if (command.getClass().isAnnotationPresent(NoAuthCheck.class) || client.isAuthenticated()) {
            executorService.submit(() -> {
                command.execute(client, manager);
            });
            return true;
        }
        return false;
    }

    private static String toJsonMessageObject(String msg) {
        return "{\"msg\": \"" + msg.replace("\"", "\\\"") + "\"}";
    }

}
