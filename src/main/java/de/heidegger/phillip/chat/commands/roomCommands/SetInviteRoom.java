package de.heidegger.phillip.chat.commands.roomCommands;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.heidegger.phillip.chat.events.roomEvents.InvitedOfRoomRequired;
import de.heidegger.phillip.chat.server.ChatClient;
import de.heidegger.phillip.chat.server.ChatServerTrustedAPI;
import de.heidegger.phillip.events.CommandMarker;

@CommandMarker
@RequireOp
public class SetInviteRoom extends AbstractRoomCommand {

    private final boolean inviteRequired;

    @JsonCreator
    public SetInviteRoom(@JsonProperty("roomName") String roomName, @JsonProperty("inviteRequired") boolean inviteRequired) {
        super(roomName);
        this.inviteRequired = inviteRequired;
    }

    @Override
    public void executeWhenAllowed(ChatClient chatClient, ChatServerTrustedAPI manager) {
        manager.spread(new InvitedOfRoomRequired(roomName, inviteRequired));
    }
}
