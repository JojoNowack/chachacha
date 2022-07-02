package de.heidegger.phillip.chat.events.userEvents;

import de.heidegger.phillip.events.EventMarker;
import de.heidegger.phillip.utils.EMail;

@EventMarker
public class LoggedIn extends AbstractUserEvent {
    private final String name;
    private final String token;

    public LoggedIn(long id, String name, EMail email, String token) {
        super(id, email);
        this.name = name;
        this.token = token;
    }

    public String getName() {
        return name;
    }

    public String getToken() {
        return token;
    }

}
