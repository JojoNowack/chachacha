package de.heidegger.phillip.chat.server;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.heidegger.phillip.chat.events.userEvents.UserRegistered;
import de.heidegger.phillip.utils.EMail;
import de.heidegger.phillip.utils.Sha1Hash;

public class ChatClientUserData {

    // Primary key
    private final EMail email;

    private final String name;
    private final Sha1Hash sha1PWHash;

    public ChatClientUserData(@JsonProperty("email") EMail email, @JsonProperty("name") String name,
                              @JsonProperty("sha1PWHash") Sha1Hash sha1PWHash) {
        if (name == null || email == null || sha1PWHash == null) {
            throw new NullPointerException();
        }
        this.name = name;
        this.email = email;
        this.sha1PWHash = sha1PWHash;
    }

    public String getName() {
        return name;
    }

    public EMail getEmail() {
        return email;
    }

    public Sha1Hash getsha1PWHash() {
        return sha1PWHash;
    }

    public boolean matches(UserRegistered ure) {
        return (email.equals(ure.getEmail()) && name.equals(ure.getName()) && sha1PWHash.equals
                (ure.getSha1PWHash()));
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ChatClientUserData that = (ChatClientUserData) o;

        return email.equals(that.email);
    }

    @Override
    public int hashCode() {
        return email.hashCode();
    }
}
