package de.heidegger.phillip.chat.server;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.heidegger.phillip.chat.events.Event;
import de.heidegger.phillip.chat.events.roomEvents.RoomJoined;
import de.heidegger.phillip.chat.events.userEvents.UserEvent;
import de.heidegger.phillip.chat.views.ChatServerRoomView;
import de.heidegger.phillip.chat.views.ChatServerUserView;
import de.heidegger.phillip.chat.views.EventView;
import de.heidegger.phillip.utils.EMail;
import de.heidegger.phillip.utils.Sha1Hash;

import java.util.concurrent.ExecutorService;
import java.util.logging.Level;
import java.util.logging.Logger;

class MyChatServerManager implements ChatServerTrustedAPI {
    private final ObjectMapper mapper = new ObjectMapper();

    private final String salt = "12345";
    // WARNING: READ THIS FROM SOME SECURE SOURCE ON THE SERVER
    private final String secret = "VERY_SECRET";
    private final AuthCommandUtils authCommandUtils = new AuthCommandUtils(salt, secret);

    private final Logger logger;
    private final Iterable<EventView> views;
    private final ExecutorService executorService;
    private final ChatServerUserView chatServerUserView;
    private final ChatServerRoomView chatServerRoomView;

    MyChatServerManager(Logger logger, Iterable<EventView> views, ExecutorService executorService, ChatServerUserView chatServerUserView, ChatServerRoomView chatServerRoomView) {
        this.logger = logger;
        this.views = views;
        this.executorService = executorService;
        this.chatServerUserView = chatServerUserView;
        this.chatServerRoomView = chatServerRoomView;
    }

    @Override
    public void spread(Event event) {
        try {
            logger.log(Level.INFO, "Spread event: " +
                    mapper.writeValueAsString(new ChatClient.EventContainer(event.getClass()
                    .getSimpleName(), event)));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        views.forEach(v -> executorService.submit(() -> v.consume(event)));
    }

    @Override
    public void log(Level info, String s) {
        logger.log(info, s);
    }

    @Override
    public boolean checkPassword(EMail email, Sha1Hash password) {
        return chatServerUserView.checkPassword(email, password);
    }

    @Override
    public boolean checkToken(EMail email, String token) {
        return false;
    }

    @Override
    public void promoteClient(ChatClient client, EMail email, String name) {
        client.promote(email, name);
    }

    @Override
    public ChatClientUserData getUser(EMail email) {
        return chatServerUserView.getUser(email);
    }

    @Override
    public boolean applied(UserEvent usre) {
        return chatServerUserView.applied(usre);
    }

    @Override
    public boolean leaveRoomCheck(ChatClient chatClient, String roomName) {
        return chatServerRoomView.leaveRoomCheck(getUser(chatClient), roomName);
    }

    @Override
    public boolean canSpeak(ChatClient chatClient, String roomName) {
        return chatServerRoomView.canSpeak(getUser(chatClient), roomName);
    }

    @Override
    public void informUserAboutRooms(ChatClient client) {
        chatServerRoomView.findRooms(client.getEmail()).forEach(joinEvent -> {
            executorService.submit(() -> client.sendEvent(joinEvent));
        });
    }

    @Override
    public boolean hasOp(ChatClient chatClient, String roomName) {
        return chatServerRoomView.hasOp(getUser(chatClient), roomName);
    }

    @Override
    public boolean hasVoice(ChatClient chatClient, String roomName) {
        return chatServerRoomView.hasVoice(getUser(chatClient), roomName);
    }

    @Override
    public boolean joinRoomCheck(ChatClient chatClient, String roomName) {
        return chatServerRoomView.joinRoomCheck(getUser(chatClient), roomName);
    }

    @Override
    public void informUserAboutRoom(ChatClient chatClient, String roomName) {

        chatServerRoomView.createRoomInformation(roomName).stream()
            .filter(e -> {
                if (e instanceof RoomJoined) {
                    RoomJoined roomJoined = (RoomJoined) e;
                    return !roomJoined.getEmail().equals(chatClient.getEmail());
                }
                return true;
            }).forEach(e -> executorService.submit(() -> chatClient.sendEvent(e)));
    }

    @Override
    public void performLogin(ChatClient client, EMail email, Sha1Hash password) {
        final String token;
        logger.log(Level.FINE, "Trying to log in: " + email.asText() + ", " + password.getHash());
        if (checkPassword(email, password)) {
            logger.log(Level.FINER, "Success, logged in: " + email.asText());
            ChatClientUserData userData = getUser(email);
            token = authCommandUtils.generateToken(userData.getName(), email, password);
        } else {
            logger.log(Level.FINER, "Login failed, combination of password and email not found.");
            token = null;
        }
        authCommandUtils.performLogin(client, this, email, token);
        logger.log(Level.FINE, "Login performed, logged in: " + email.asText());
    }

    @Override
    public void performLogin(ChatClient client, EMail email, String token) {
        authCommandUtils.performLogin(client, this, email, authCommandUtils.validateToken(client, token));
    }

    @Override
    public boolean existsUser(EMail email) {
        return getUser(email) != null;
    }

    private ChatClientUserData getUser(ChatClient chatClient) {
        return getUser(chatClient.getEmail());
    }

}
