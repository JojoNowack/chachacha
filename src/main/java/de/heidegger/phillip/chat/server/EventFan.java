package de.heidegger.phillip.chat.server;

import de.heidegger.phillip.chat.events.Event;

public interface EventFan {

    void spread(Event event);

}
