package de.heidegger.phillip.chat.events.userEvents;

import de.heidegger.phillip.chat.server.ChatClient;
import de.heidegger.phillip.utils.EMail;

import java.util.Objects;

public class AbstractUserEvent implements UserEvent {
    private final EMail email;
    private final long id;

    public AbstractUserEvent(long id, EMail email) {
        this.email = email;
        this.id = id;
    }

    public EMail getEmail() {
        return email;
    }

    public long getId() {
        return this.id;
    }

    @Override
    public boolean forUser(ChatClient client) {
        return Objects.equals(client.getEmail(), this.email) || client.getId() == id;
    }
}
