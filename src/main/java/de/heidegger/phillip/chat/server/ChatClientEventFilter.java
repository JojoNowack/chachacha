package de.heidegger.phillip.chat.server;

import de.heidegger.phillip.chat.events.Event;
import de.heidegger.phillip.chat.events.roomEvents.RoomEvent;
import de.heidegger.phillip.chat.events.userEvents.LoggedOut;
import de.heidegger.phillip.chat.events.userEvents.UserEvent;
import de.heidegger.phillip.chat.views.ChatServerRoomView;
import de.heidegger.phillip.chat.views.EventView;

public class ChatClientEventFilter implements EventView {

    private final ChatClient client;
    private final ChatServerRoomView roomView;

    ChatClientEventFilter(ChatClient client, ChatServerRoomView roomView) {
        this.client = client;
        this.roomView = roomView;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ChatClientEventFilter that = (ChatClientEventFilter) o;

        return client != null ? client.equals(that.client) : that.client == null;
    }

    @Override
    public int hashCode() {
        return client != null ? client.hashCode() : 0;
    }

    @Override
    public boolean applied(Event event) {
        return false;
    }

    @Override
    public void consume(Event event) {
        if (event instanceof UserEvent) {
            UserEvent userEvent = (UserEvent) event;
            if (userEvent.forUser(client)) {
                this.client.consume(event);
                return;
            }
        }
        if (event instanceof RoomEvent) {
            RoomEvent roomEvent = (RoomEvent) event;
            if (roomView.isInRoom(roomEvent.getRoomName(), client.getEmail())) {
                client.consume(event);
                return;
            }
        }
        if (!(event instanceof UserEvent) && !(event instanceof RoomEvent)) {
            client.consume(event);
            return ;
        }
        if (event instanceof LoggedOut) {
            LoggedOut loggedOut = (LoggedOut) event;
            if (loggedOut.getId() == this.client.getId()) {
                client.consume(event);
            }
        }
    }
}
