package de.heidegger.phillip.chat.commands.userCommands;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.heidegger.phillip.chat.commands.Command;
import de.heidegger.phillip.chat.commands.NoAuthCheck;
import de.heidegger.phillip.chat.events.userEvents.UserRegistered;
import de.heidegger.phillip.chat.server.ChatClient;
import de.heidegger.phillip.chat.server.ChatServerTrustedAPI;
import de.heidegger.phillip.events.CommandMarker;
import de.heidegger.phillip.utils.EMail;
import de.heidegger.phillip.utils.Sha1Hash;

@CommandMarker
@NoAuthCheck
public class RegisterUser implements Command {
    private final EMail email;
    private final String name;
    private final Sha1Hash password;

    @JsonCreator
    public RegisterUser(@JsonProperty("email") EMail email,
                        @JsonProperty("name") String name,
                        @JsonProperty("password") String password) {
        this.email = email;
        this.name = name;
        this.password = Sha1Hash.createFromValue(password);
    }

    public String getName() {
        return name;
    }

    public EMail getEmail() {
        return email;
    }

    public Sha1Hash getPassword() {
        return password;
    }

    @Override
    public void execute(ChatClient client, ChatServerTrustedAPI manager) {
        // register user commands does not require privileges, so just
        // convert them to an event and apply them
        if (!manager.existsUser(email)) {
            UserRegistered usre = new UserRegistered(client.getId(), email, name, password);
            manager.spread(usre);
        }
    }

    public String toString() {
        return "COMMAND: RegisterUser.";
    }

}
