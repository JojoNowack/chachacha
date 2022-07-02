package de.heidegger.phillip.chat.events.userEvents;


import de.heidegger.phillip.events.EventMarker;
import de.heidegger.phillip.utils.EMail;
import de.heidegger.phillip.utils.Sha1Hash;

@EventMarker
public class ChangedUserPassword extends AbstractUserEvent implements UserEvent {
    private final Sha1Hash newSha1PWHash;

    public ChangedUserPassword(long id, EMail email, Sha1Hash newSha1PWHash) {
        super(id, email);
        this.newSha1PWHash = newSha1PWHash;
    }

    public Sha1Hash getNewSha1PWHash() {
        return newSha1PWHash;
    }

}
