package de.heidegger.phillip.chat.events.userEvents;

import de.heidegger.phillip.chat.server.ChatClient;
import de.heidegger.phillip.chat.events.Event;
import de.heidegger.phillip.events.EventMarker;

@EventMarker
public interface UserEvent extends Event {
    boolean forUser(ChatClient mail);
}
