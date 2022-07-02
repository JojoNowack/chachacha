package de.heidegger.phillip.chat.events.userEvents;

import de.heidegger.phillip.events.EventMarker;
import de.heidegger.phillip.utils.EMail;

@EventMarker
public class UserRenamed extends AbstractUserEvent {
    private final String name;

    public UserRenamed(long id, String name, EMail email) {
        super(id, email);
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
