package de.heidegger.phillip.chat.commands.userCommands;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.heidegger.phillip.chat.commands.NoAuthCheck;
import de.heidegger.phillip.chat.server.ChatClient;
import de.heidegger.phillip.chat.server.ChatServerPublicAPI;
import de.heidegger.phillip.events.CommandMarker;
import de.heidegger.phillip.utils.EMail;

@CommandMarker
@NoAuthCheck
public class AuthWithJWTToken extends PublicCommand {

    private final String token;
    private final EMail email;

    @JsonCreator
    public AuthWithJWTToken(@JsonProperty("token") String token, @JsonProperty("Email") EMail email) {
        this.token = token;
        this.email = email;
    }

    public String toString() {
        return "COMMAND: Login of '" + this.token + "' with '" + this.token + "'";
    }

    public EMail getEmail() {
        return email;
    }

    @Override
    public void executeWithPublicApi(ChatClient client, ChatServerPublicAPI manager) {
        manager.performLogin(client, getEmail(), token);
    }

}
