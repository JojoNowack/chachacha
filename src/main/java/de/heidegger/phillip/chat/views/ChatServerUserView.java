package de.heidegger.phillip.chat.views;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.heidegger.phillip.chat.server.ChatClientUserData;
import de.heidegger.phillip.chat.events.*;
import de.heidegger.phillip.chat.events.userEvents.ChangedUserPassword;
import de.heidegger.phillip.chat.events.userEvents.UserEvent;
import de.heidegger.phillip.chat.events.userEvents.UserRegistered;
import de.heidegger.phillip.chat.events.userEvents.UserRenamed;
import de.heidegger.phillip.utils.EMail;
import de.heidegger.phillip.utils.Sha1Hash;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Consumes user events and build up a map from emails
 * to ChatClientUserData objects.
 *
 * Can check if a password is correct.
 *
 * Can be serialized to a json representation used to save a
 * snapshot of the view.
 */
public class ChatServerUserView implements EventView {

    private final Map<EMail, ChatClientUserData> userMap = new HashMap<>();

    private ChatServerUserView(Iterator<Event> events) {
        consume(events);
    }

    /**
     * Intermediate Step so that the ChatServerUserView can load its data.
     *
     * TODO:
     * In the end this should happen by
     * 1. Loading the hash of the last event from the stream
     * 2. Find a snapshot that correspond to the hash. If found, load it.
     * 3. If there is no snapshot found, use binary search to find a hash
     *    for which a snapshot exists.
     * @param path
     */
    @Deprecated
    public ChatServerUserView(Path path) {
        if (Files.exists(path)) {
            try (InputStream is = Files.newInputStream(path)) {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(is);
                JsonNode entries = root.get("data");
                for (JsonNode e : entries) {
                    String name = e.get("name").asText();
                    EMail email = new EMail(e.get("email").asText());
                    String sha1PWHash = e.get("sha1PWHash").asText();
                    userMap.put(email, new ChatClientUserData(email, name, Sha1Hash.createFromHash(sha1PWHash)));
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("Users file not found. Use empty file.");
        }
    }

    public boolean applied(Event event) {
        if (event instanceof UserRegistered) {
            UserRegistered ure = (UserRegistered) event;
            ChatClientUserData ccu = userMap.get(ure.getEmail());
            return ccu.matches(ure);
        }
        return false;
    }

    public void consume(Event event) {
        if (event instanceof UserEvent) {
            consume((UserEvent) event);
        }
    }

    public ChatClientUserData getUser(EMail email) {
        return userMap.get(email);
    }

    public void save(Path path) {
        JsonFactory factory = new JsonFactory();
        try (OutputStream os = Files.newOutputStream(path);
             JsonGenerator jg = factory.createGenerator(os)) {

            jg.writeStartObject();
            jg.writeArrayFieldStart("data");
            for (ChatClientUserData chatClientUserData : userMap.values()) {
                jg.writeStartObject();
                jg.writeStringField("name", chatClientUserData.getName());
                jg.writeStringField("email", chatClientUserData.getEmail().asText());
                jg.writeStringField("sha1PWHash", chatClientUserData.getsha1PWHash().getHash());
                jg.writeEndObject();
            }
            jg.writeEndArray();
            jg.writeEndObject();

        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    private void addUser(EMail email, String name, Sha1Hash sha1PWhash) {
        if (!userMap.containsKey(email)) {
            userMap.put(email, new ChatClientUserData(email, name, sha1PWhash));
        }
    }

    public boolean checkPassword(EMail email, Sha1Hash password) {
        if (userMap.containsKey(email)) {
            ChatClientUserData chatClientUserData = userMap.get(email);
            if (chatClientUserData.getsha1PWHash().equals(password)) {
                return true;
            }
        }
        return false;
    }

    private void consume(UserEvent event) {
        if (event instanceof UserRegistered) {
            UserRegistered ure = (UserRegistered) event;
            addUser(ure.getEmail(), ure.getName(), ure.getSha1PWHash());
        }
        if (event instanceof UserRenamed) {
            UserRenamed renameUser = (UserRenamed) event;
            ChatClientUserData chatClientUserData = userMap.get(renameUser.getEmail());
            ChatClientUserData newChatClientUserData = new ChatClientUserData(chatClientUserData.getEmail(),
                    renameUser.getName(), chatClientUserData.getsha1PWHash());
            userMap.put(chatClientUserData.getEmail(), newChatClientUserData);
        }
        if (event instanceof ChangedUserPassword) {
            ChangedUserPassword changeUserPassword = (ChangedUserPassword) event;
            ChatClientUserData chatClientUserData = userMap.get(changeUserPassword.getEmail());
            ChatClientUserData newChatClientUserData = new ChatClientUserData(chatClientUserData.getEmail(),
                    chatClientUserData.getName(), changeUserPassword.getNewSha1PWHash());
            userMap.put(chatClientUserData.getEmail(), newChatClientUserData);
        }
        // TODO: continue to add other Uservents here, e.g. change name, change password, etc.

    }
}
