package de.heidegger.phillip.chat.commands.roomCommands;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.heidegger.phillip.chat.events.roomEvents.MessageSendToRoom;
import de.heidegger.phillip.chat.server.ChatClient;
import de.heidegger.phillip.chat.server.ChatServerTrustedAPI;
import de.heidegger.phillip.events.CommandMarker;

@CommandMarker
@RequireVoice
public class SendMessageToRoom extends AbstractRoomCommand {
    private final String message;

    @JsonCreator
    public SendMessageToRoom(@JsonProperty("roomName") String roomName,
                             @JsonProperty("message") String message) {
        super(roomName);
        this.message = message;
    }

    @Override
    public void executeWhenAllowed(ChatClient chatClient, ChatServerTrustedAPI manager) {
        if (manager.canSpeak(chatClient, roomName)) {
            manager.spread(new MessageSendToRoom(roomName, chatClient.getEmail(), message, chatClient.getUserName()));
        }
    }
}
