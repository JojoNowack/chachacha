package de.heidegger.phillip.chat.events.userEvents;

import de.heidegger.phillip.events.EventMarker;
import de.heidegger.phillip.utils.EMail;

@EventMarker
public class LoggedOut extends AbstractUserEvent {

    public LoggedOut(long id, EMail email) {
        super(id, email);
    }
}
