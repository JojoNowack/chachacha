package de.heidegger.phillip.chat.server;

import de.heidegger.phillip.chat.events.userEvents.UserEvent;
import de.heidegger.phillip.utils.EMail;
import de.heidegger.phillip.utils.Sha1Hash;

public interface ChatServerUserManagement extends EventFan {

    boolean existsUser(EMail email);

    ChatClientUserData getUser(EMail email);

    boolean checkPassword(EMail email, Sha1Hash password);

    boolean checkToken(EMail email, String token);

    void promoteClient(ChatClient client, EMail email, String name);

    boolean applied(UserEvent usre);

}
