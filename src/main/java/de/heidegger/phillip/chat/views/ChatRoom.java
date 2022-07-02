package de.heidegger.phillip.chat.views;

import de.heidegger.phillip.chat.server.ChatClientSet;
import de.heidegger.phillip.chat.server.ChatClientUserData;
import de.heidegger.phillip.chat.events.Event;
import de.heidegger.phillip.chat.events.roomEvents.OpGranted;
import de.heidegger.phillip.chat.events.roomEvents.RoomJoined;
import de.heidegger.phillip.chat.events.roomEvents.VoiceGranted;
import de.heidegger.phillip.utils.EMail;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ChatRoom {

    private final String name;
    private final ChatClientSet users = new ChatClientSet();
    private final ChatClientSet ops = new ChatClientSet();
    private final ChatClientSet withVoice = new ChatClientSet();

    private boolean requiresVoice = false;
    private boolean requiresInvite = false;

    private final Set<EMail> invitedUsers = new HashSet<>();

    ChatRoom(String name) {
        this.name = name;
    }

    boolean isInRoom(ChatClientUserData chatClientUserData) {
        return users.contains(chatClientUserData);
    }

    boolean joinRoomCheck(ChatClientUserData chatClientUserData) {
        if (!requiresInvite || invitedUsers.contains(chatClientUserData.getEmail())) {
            return !users.contains(chatClientUserData);
        }
        return false;
    }

    boolean joinRoom(ChatClientUserData chatClient) {
        if (joinRoomCheck(chatClient)) {
            return users.add(chatClient);
        }
        return false;
    }

    boolean leaveRoom(ChatClientUserData chatClientUserData) {
        return users.remove(chatClientUserData);

    }

    boolean isOp(ChatClientUserData chatClientUserData) {
        return ops.contains(chatClientUserData);
    }

    boolean hasVoice(ChatClientUserData chatClientUserData) {
        return withVoice.contains(chatClientUserData) || isOp(chatClientUserData);
    }

    boolean giveVoice(ChatClientUserData chatClientUserData, boolean voice) {
        if (voice) {
            return withVoice.add(chatClientUserData);
        } else {
            return withVoice.remove(chatClientUserData);
        }
    }

    boolean giveOp(ChatClientUserData chatClientUserData, boolean op) {
        if (op) {
            return ops.add(chatClientUserData);
        } else {
            return ops.remove(chatClientUserData);
        }
    }

    public void setInviteUser(EMail user, boolean invite) {
        if (invite) {
            invitedUsers.add(user);
        } else {
            invitedUsers.remove(user);
        }
    }

    List<Event> createRoomInformation() {
        List<Event> eventList = new ArrayList<>(users.size());
        users.forEach(u -> eventList.add(new RoomJoined(name, u.getEmail(),u.getName())));
        ops.forEach(u -> eventList.add(new OpGranted(name, u.getEmail(), true)));
        withVoice.forEach(u -> eventList.add(new VoiceGranted(name, u.getEmail(), true)));
        return eventList;
    }

    public String getName() {
        return name;
    }

    boolean canSpeak(ChatClientUserData chatClientUserData) {
        return isInRoom(chatClientUserData) && (!requiresVoice || hasVoice(chatClientUserData));
    }

    boolean isInRoom(EMail email) {
        return users.contains(email);
    }

    void setRequiresInvite(boolean invite) {
        this.requiresInvite = invite;
    }

    void setRequiresVoice(boolean requiresVoice) {
        this.requiresVoice = requiresVoice;
    }

    boolean isEmpty() {
        return users.isEmpty();
    }
}
