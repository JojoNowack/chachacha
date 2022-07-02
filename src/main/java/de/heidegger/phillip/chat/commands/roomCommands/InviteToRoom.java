package de.heidegger.phillip.chat.commands.roomCommands;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.heidegger.phillip.chat.events.roomEvents.InvitedToRoom;
import de.heidegger.phillip.chat.server.ChatClient;
import de.heidegger.phillip.chat.server.ChatServerTrustedAPI;
import de.heidegger.phillip.events.CommandMarker;
import de.heidegger.phillip.utils.EMail;

@CommandMarker
@RequireOp
public class InviteToRoom extends AbstractRoomUserCommand {

    private final boolean invite;

    public InviteToRoom(@JsonProperty("roomName") String roomName, @JsonProperty("email") EMail eMail,
                        @JsonProperty("invite") boolean invite) {
        super(roomName, eMail);
        this.invite = invite;
    }

    @Override
    public void executeWhenAllowed(ChatClient chatClient, ChatServerTrustedAPI manager) {
        manager.spread(new InvitedToRoom(roomName, email, invite));
    }
}
