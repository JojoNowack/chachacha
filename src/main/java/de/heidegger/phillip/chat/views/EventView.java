package de.heidegger.phillip.chat.views;

import de.heidegger.phillip.chat.events.Event;

import java.util.Iterator;

public interface EventView {

    void consume(Event event);

    default void consume(Iterator<Event> events) {
        while (events.hasNext()) {
            consume(events.next());
        }
    }

    default boolean applied(Event event) {
        return false;
    };

}
