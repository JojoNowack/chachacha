package de.heidegger.phillip.chat.commands;

import de.heidegger.phillip.chat.server.ChatClient;
import de.heidegger.phillip.chat.server.ChatServerTrustedAPI;

public interface Command {
    void execute(ChatClient chatClient, ChatServerTrustedAPI manager);
}
