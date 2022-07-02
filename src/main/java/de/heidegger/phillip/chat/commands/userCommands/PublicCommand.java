package de.heidegger.phillip.chat.commands.userCommands;

import de.heidegger.phillip.chat.commands.Command;
import de.heidegger.phillip.chat.server.ChatClient;
import de.heidegger.phillip.chat.server.ChatServerPublicAPI;
import de.heidegger.phillip.chat.server.ChatServerTrustedAPI;

public abstract class PublicCommand implements Command {

    @Override
    public final void execute(ChatClient chatClient, ChatServerTrustedAPI manager) {
        this.executeWithPublicApi(chatClient, manager);
    }

    protected abstract void executeWithPublicApi(ChatClient chatClient, ChatServerPublicAPI manager);

}
