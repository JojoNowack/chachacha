package de.heidegger.phillip.chat.events.userEvents;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.heidegger.phillip.events.EventMarker;
import de.heidegger.phillip.utils.EMail;
import de.heidegger.phillip.utils.Sha1Hash;

@EventMarker
public class UserRegistered extends AbstractUserEvent {
    private final String name;
    private final Sha1Hash sha1PWHash;

    @JsonCreator
    public UserRegistered(@JsonProperty("id") long id,
                          @JsonProperty("email") EMail email,
                          @JsonProperty("name") String name,
                          @JsonProperty("sha1PWHash") String sha1PWHash) {
        super(id, email);
        this.name = name;
        this.sha1PWHash = Sha1Hash.createFromHash(sha1PWHash);
    }

    public UserRegistered(long id, EMail email, String name, Sha1Hash sha1PWHash) {
        super(id, email);
        this.name = name;
        this.sha1PWHash = sha1PWHash;
    }


    public String getName() {
        return name;
    }

    public Sha1Hash getSha1PWHash() {
        return sha1PWHash;
    }
}
