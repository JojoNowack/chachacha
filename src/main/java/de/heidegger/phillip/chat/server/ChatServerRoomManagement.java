package de.heidegger.phillip.chat.server;

public interface ChatServerRoomManagement {

    boolean leaveRoomCheck(ChatClient chatClient, String roomName);

    boolean canSpeak(ChatClient chatClient, String roomName);

    void informUserAboutRooms(ChatClient client);

    boolean hasOp(ChatClient chatClient, String roomName);

    boolean hasVoice(ChatClient chatClient, String roomName);

    /**
     * Tests if it is possible for the user to join the room.
     *
     * @param chatClient The chat client that wants to join the room.
     * @param roomName The name of the room.
     * @return if the join is possible.
     */
    boolean joinRoomCheck(ChatClient chatClient, String roomName);

    /**
     * Fires Events to the chatClient to tell the client which users
     * are is the room, etc.
     *
     * @param chatClient The user jointed the room and requires the information.
     * @param roomName The room that was joined.
     */
    void informUserAboutRoom(ChatClient chatClient, String roomName);

}
