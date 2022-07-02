package de.heidegger.phillip.chat.views;

import de.heidegger.phillip.chat.events.Event;
import de.heidegger.phillip.chat.events.roomEvents.*;
import de.heidegger.phillip.chat.server.ChatClientUserData;
import de.heidegger.phillip.chat.server.EventFan;
import de.heidegger.phillip.utils.EMail;

import java.util.*;

/**
 * A view that manages the rooms. This includes:
 * - Which useres are currently in the room
 * - Which users do have operator or voice
 * - Does the room require voice to speak
 * - Which users are invited to a room
 * - Does the room require an invitation to join the room
 *
 * Currently the view is not persistent. Hence, each restart of the server results in
 * an new empty set of rooms.
 */
public class ChatServerRoomView implements EventView {

    private final ChatServerUserView chatServerUserView;
    private final Map<String, ChatRoom> rooms = new HashMap<>();
    private final EventFan chatServerManager;

    public ChatServerRoomView(EventFan chatServerManager, ChatServerUserView chatServerUserView) {
        this.chatServerManager = chatServerManager;
        this.chatServerUserView = chatServerUserView;
    }

    @Override
    public boolean applied(Event event) {
        return false;
    }

    @Override
    public void consume(Event event) {
        if (event instanceof RoomEvent) {
            this.consume((RoomEvent) event);
        }
    }

    public void consume(RoomEvent roomEvent) {
        final String roomName = roomEvent.getRoomName();
        if (roomEvent instanceof RoomJoined) {
            RoomJoined roomJoined = (RoomJoined) roomEvent;

            final boolean makeOp;
            final boolean giveVoice;
            ChatRoom room;
            if (!rooms.containsKey(roomName)) {
                room = new ChatRoom(roomName);
                rooms.put(roomName, room);
                makeOp = giveVoice = true;
            } else {
                room = rooms.get(roomName);
                makeOp = giveVoice = room.isEmpty();
            }
            ChatClientUserData client = chatServerUserView.getUser(roomJoined.getEmail());
            if (room.joinRoom(client)) {
                // We only need to send the event, if the user is promoted here really. If he was
                // operator anyway, the method createRoomInformation will generate the events. So wee
                // should not create them a second time.
                if (makeOp && !room.isOp(client)) {
                    chatServerManager.spread(new OpGranted(roomName, client.getEmail(), true));
                }
                // Same check to avoid duplication of events as with the operator.
                if (giveVoice && !room.hasVoice(client)) {
                    chatServerManager.spread(new VoiceGranted(roomName, client.getEmail(), true));
                }
            }
        }
        ChatRoom room = rooms.get(roomName);
        if (room != null) {
            if (roomEvent instanceof RoomLeft) {
                RoomLeft roomLeft = (RoomLeft) roomEvent;
                room.leaveRoom(chatServerUserView.getUser(roomLeft.getEmail()));
            }
            if (roomEvent instanceof InvitedOfRoomRequired) {
                InvitedOfRoomRequired invitedOfRoomRequired = (InvitedOfRoomRequired) roomEvent;
                room.setRequiresInvite(invitedOfRoomRequired.isInviteRequired());
            }
            if (roomEvent instanceof VoiceInRoomRequired) {
                VoiceInRoomRequired voiceInRoomRequired = (VoiceInRoomRequired) roomEvent;
                room.setRequiresVoice(voiceInRoomRequired.getVoice());
            }
            if (roomEvent instanceof OpGranted) {
                OpGranted opGranted = (OpGranted) roomEvent;
                room.giveOp(chatServerUserView.getUser(opGranted.getEMail()), opGranted.getOp());
            }
            if (roomEvent instanceof VoiceGranted) {
                VoiceGranted voiceGranted = (VoiceGranted) roomEvent;
                room.giveVoice(chatServerUserView.getUser(voiceGranted.getEMail()), voiceGranted.getVoice());
            }
            if (roomEvent instanceof InvitedToRoom) {
                InvitedToRoom invitedToRoom = (InvitedToRoom) roomEvent;
                room.setInviteUser(invitedToRoom.getEmail(), invitedToRoom.getInvite());
            }
        }
    }

    public boolean joinRoomCheck(ChatClientUserData chatClientUserData, String roomName) {
        ChatRoom chatRoom = rooms.get(roomName);
        return chatRoom == null || chatRoom.joinRoomCheck(chatClientUserData);
    }

    public boolean leaveRoomCheck(ChatClientUserData chatClientUserData, String roomName) {
        ChatRoom chatRoom = rooms.get(roomName);
        return chatRoom != null && chatRoom.isInRoom(chatClientUserData);
    }
    public List<Event> createRoomInformation(String roomName) {
        ChatRoom chatRoom = rooms.get(roomName);
        if (chatRoom == null) {
            return Collections.EMPTY_LIST;
        }
        return chatRoom.createRoomInformation();
    }


    public List<String> leaveAllRooms(ChatClientUserData chatClientUserData) {
        List<String> leaveEvents = new ArrayList<>();
        rooms.values().forEach(r -> {
            if (r.isInRoom(chatClientUserData)) {
                leaveEvents.add(r.getName());
            };
        });
        return leaveEvents;
    }

    public boolean canSpeak(ChatClientUserData chatClientUserData, String roomName) {
        ChatRoom chatRoom = rooms.get(roomName);
        return chatRoom != null && chatRoom.canSpeak(chatClientUserData);
    }

    public boolean isInRoom(String roomName, EMail user) {
        return rooms.get(roomName).isInRoom(user);
    }

    public List<Event> findRooms(EMail email) {
        if (email == null) {
            return Collections.EMPTY_LIST;
        }
        List<Event> events = new ArrayList<>();
        rooms.values().forEach(r -> {
            if (r.isInRoom(email)) {
                events.addAll(createRoomInformation(r.getName()));
            }
        });
        return events;
    }

    public boolean hasOp(ChatClientUserData chatClientUserData, String roomName) {
        ChatRoom chatRoom = rooms.get(roomName);
        return chatRoom != null && chatRoom.isOp(chatClientUserData);
    }

    public boolean hasVoice(ChatClientUserData chatClientUserData, String roomName) {
        ChatRoom chatRoom = rooms.get(roomName);
        return chatRoom != null && chatRoom.hasVoice(chatClientUserData);
    }
}
