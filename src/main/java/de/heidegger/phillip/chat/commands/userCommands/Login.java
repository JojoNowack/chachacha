package de.heidegger.phillip.chat.commands.userCommands;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.heidegger.phillip.chat.commands.NoAuthCheck;
import de.heidegger.phillip.chat.server.ChatClient;
import de.heidegger.phillip.chat.server.ChatServerPublicAPI;
import de.heidegger.phillip.events.CommandMarker;
import de.heidegger.phillip.utils.EMail;
import de.heidegger.phillip.utils.Sha1Hash;

@CommandMarker
@NoAuthCheck
public class Login extends PublicCommand {
    private final EMail email;
    private final Sha1Hash password;

    @JsonCreator
    public Login(@JsonProperty("email") EMail email, @JsonProperty("password") String password) {
        this.email = email;
        this.password = Sha1Hash.createFromValue(password);
    }

    public String toString() {
        return "COMMAND: Login of '" + this.email + "' with '" + this.password + "'";
    }


    public Sha1Hash getPassword() {
        return password;
    }

    public EMail getEmail() {
        return email;
    }

    @Override
    public void executeWithPublicApi(ChatClient client, ChatServerPublicAPI manager) {
        manager.performLogin(client, getEmail(), getPassword());
    }

    private static String toJsonMessageObject(String msg) {
        return "{\"msg\": \"" + msg.replace("\"", "\\\"") + "\"}";
    }
}

