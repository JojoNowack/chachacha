package de.heidegger.phillip.chat.events.userEvents;

import de.heidegger.phillip.utils.EMail;

public class ChangePasswordFailed extends AbstractUserEvent {

    public ChangePasswordFailed(long id, EMail email) {
        super(id, email);
    }
}
