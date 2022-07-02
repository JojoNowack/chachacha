package de.heidegger.phillip.chat.server;

import de.heidegger.phillip.utils.EMail;
import de.heidegger.phillip.utils.Sha1Hash;

import java.util.logging.Level;

public interface ChatServerPublicAPI extends EventFan {

    void log(Level info, String s);

    void performLogin(ChatClient client, EMail email, Sha1Hash password);

    void performLogin(ChatClient client, EMail email, String token);
}
