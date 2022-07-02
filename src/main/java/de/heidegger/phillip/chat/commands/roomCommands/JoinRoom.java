package de.heidegger.phillip.chat.commands.roomCommands;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.heidegger.phillip.chat.events.roomEvents.OpGranted;
import de.heidegger.phillip.chat.events.roomEvents.RoomJoined;
import de.heidegger.phillip.chat.events.roomEvents.VoiceGranted;
import de.heidegger.phillip.chat.server.ChatClient;
import de.heidegger.phillip.chat.server.ChatServerTrustedAPI;
import de.heidegger.phillip.events.CommandMarker;

@CommandMarker
public class JoinRoom extends AbstractRoomCommand {

    @JsonCreator
    public JoinRoom(@JsonProperty("roomName") String roomName) {
        super(roomName);
    }

    @Override
    public void executeWhenAllowed(ChatClient chatClient, ChatServerTrustedAPI manager) {
        if (manager.joinRoomCheck(chatClient, roomName)) {
            manager.spread(new RoomJoined(roomName, chatClient.getEmail(),
                    chatClient.getUserName()));
            if (manager.hasOp(chatClient, roomName)) {
                manager.spread(new OpGranted(roomName, chatClient.getEmail(), true));
            }
            if (manager.hasVoice(chatClient, roomName)) {
                manager.spread(new VoiceGranted(roomName, chatClient.getEmail(), true));
            }
            manager.informUserAboutRoom(chatClient, roomName);
        };
    }

    public String toString() {
        return "COMMAND: JoinRoom: '" + this.roomName + "'";
    }
}
