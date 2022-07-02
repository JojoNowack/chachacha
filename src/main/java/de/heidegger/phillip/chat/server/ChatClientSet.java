package de.heidegger.phillip.chat.server;

import de.heidegger.phillip.utils.EMail;

import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

public class ChatClientSet implements Iterable<ChatClientUserData> {
    private final Set<ChatClientUserData> users = new HashSet<>();

    public boolean contains(ChatClientUserData chatClientUserData) {
        return users.contains(chatClientUserData);
    }

    public boolean add(ChatClientUserData chatClientUserData) {
        return users.add(chatClientUserData);
    }

    public boolean remove(ChatClientUserData chatClientUserData) {
        return users.remove(chatClientUserData);
    }

    @Override
    public Iterator<ChatClientUserData> iterator() {
        return users.iterator();
    }

    public int size() {
        return users.size();
    }

    public boolean contains(EMail email) {
        return users.stream().anyMatch(chatClientUser -> email.equals(chatClientUser.getEmail()));
    }

    public boolean isEmpty() {
        return users.isEmpty();
    }
}
