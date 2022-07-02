package de.heidegger.phillip.chat.events.roomEvents;


import com.fasterxml.jackson.annotation.JsonProperty;
import de.heidegger.phillip.chat.server.ChatClient;
import de.heidegger.phillip.chat.events.userEvents.UserEvent;
import de.heidegger.phillip.events.EventMarker;
import de.heidegger.phillip.utils.EMail;

import java.util.Objects;

@EventMarker
public class RoomLeft extends AbstractRoomEvent implements UserEvent {
    private final EMail email;

    public RoomLeft(@JsonProperty String roomName, @JsonProperty EMail email) {
        super(roomName);
        this.email = email;
    }

    public EMail getEmail() {
        return email;
    }

    @Override
    public boolean forUser(ChatClient mail) {
        return Objects.equals(email,mail.getEmail());
    }
}
