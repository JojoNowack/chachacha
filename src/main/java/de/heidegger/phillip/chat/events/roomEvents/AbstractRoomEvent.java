package de.heidegger.phillip.chat.events.roomEvents;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AbstractRoomEvent implements RoomEvent {
    protected final String roomName;

    public AbstractRoomEvent(@JsonProperty String roomName) {
        this.roomName = roomName;
    }

    public String getRoomName() {
        return roomName;
    }


}
