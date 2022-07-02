package de.heidegger.phillip.chat.events.roomEvents;

import de.heidegger.phillip.events.EventMarker;
import de.heidegger.phillip.utils.EMail;

@EventMarker
public class MessageSendToRoom extends AbstractRoomEvent {

    private final EMail email;
    private final String message;
    private final String userName;

    public MessageSendToRoom(String roomName, EMail email, String message, String userName) {
        super(roomName);
        this.email = email;
        this.message = message;
        this.userName = userName;
    }

    public EMail getEmail() {
        return email;
    }

    public String getMessage() {
        return message;
    }

    public String getUserName() {
        return userName;
    }
}
