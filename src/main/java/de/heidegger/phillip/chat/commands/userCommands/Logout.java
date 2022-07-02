package de.heidegger.phillip.chat.commands.userCommands;

import de.heidegger.phillip.chat.commands.Command;
import de.heidegger.phillip.chat.server.ChatClient;
import de.heidegger.phillip.chat.server.ChatServerTrustedAPI;
import de.heidegger.phillip.events.CommandMarker;

import java.util.logging.Level;

@CommandMarker
public class Logout implements Command {

    @Override
    public void execute(ChatClient client, ChatServerTrustedAPI manager) {
        manager.log(Level.INFO, "User " + client.getEmail() + " logged out.");
        client.logout();
    }

    public String toString() {
        return "COMMAND: Logout.";
    }

}
