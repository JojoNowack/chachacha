package de.heidegger.phillip.chat.events.roomEvents;

import de.heidegger.phillip.chat.events.userEvents.UserEvent;
import de.heidegger.phillip.chat.server.ChatClient;
import de.heidegger.phillip.utils.EMail;

import java.util.Objects;

public class InvitedToRoom extends AbstractRoomEvent implements UserEvent {

    private final EMail email;
    private final boolean invite;

    public InvitedToRoom(String roomName, EMail email, boolean invite) {
        super(roomName);
        this.email = email;
        this.invite = invite;
    }

    public EMail getEmail() {
        return email;
    }

    public boolean getInvite() {
        return invite;
    }

    @Override
    public boolean forUser(ChatClient client) {
        return Objects.equals(client.getEmail(), this.email);
    }
}
