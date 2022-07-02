import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {
  ChatMessage,
  InvitedOfRoomRequiredEvent,
  InvitedToRoomEvent,
  MessageSentToRoomEvent,
  OpGrantedEvent,
  RoomJoinedEvent,
  RoomLeftEvent,
  VoiceGrantedEvent,
  VoiceInRoomRequiredEvent,
  Room,
  User
} from './types';
import { WebsocketService } from './websocket.service';
import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs";
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private readonly invitedOfRoomRequiredMessages = new ReplaySubject<InvitedOfRoomRequiredEvent>();
  private readonly invitedToRoomMessages = new ReplaySubject<InvitedToRoomEvent>();
  private readonly messageSentToRoomMessages = new ReplaySubject<MessageSentToRoomEvent>();
  private readonly opGrantedMessages = new ReplaySubject<OpGrantedEvent>();
  private readonly roomJoinedMessages = new ReplaySubject<RoomJoinedEvent>();
  private readonly roomLeftMessages = new ReplaySubject<RoomLeftEvent>();
  private readonly voiceGrantedMessages = new ReplaySubject<VoiceGrantedEvent>();
  private readonly voiceInRoomRequiredMessages = new ReplaySubject<VoiceInRoomRequiredEvent>();

  private readonly chatMessages = new BehaviorSubject<ChatMessage[]>([]);
  private readonly newChatMessage = new ReplaySubject<ChatMessage>();
  private readonly rooms = new BehaviorSubject<Room[]>([]);

  currentUser: User = new User;
  loggedIn: boolean = false;

  constructor(private webSocketService: WebsocketService, private userService: UserService) {
    this.isLoggedIn();
    this.getUser();
    this.handleEvents();
  }

  isLoggedIn(): void {
    this.userService.isLoggedIn().subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    });
  }

  getUser(): void {
    this.userService.getUser().subscribe(user => {
      this.currentUser = user;
    })
  }

  private handleEvents() {
    const messages = this.webSocketService.getMessages();
    messages.subscribe((message) => {
      let data = JSON.parse(message.data);
      let type: string = data.type;
      let value = data.value;
      switch (type) {
        case 'InvitedOfRoomRequired':
          let invitedOfRoomRequiredEvent: InvitedOfRoomRequiredEvent = value;
          this.invitedOfRoomRequiredMessages.next(invitedOfRoomRequiredEvent);
          break;
        case 'InvitedToRoom':
          let invitedToRoomEvent: InvitedToRoomEvent = value;
          this.invitedToRoomMessages.next(invitedToRoomEvent);
          break;
        case 'MessageSendToRoom':
          let messageSentToRoomEvent: MessageSentToRoomEvent = value;
          this.messageSentToRoomMessages.next(messageSentToRoomEvent);
          break;
        case 'OpGranted':
          let opGrantedEvent: OpGrantedEvent = value;
          this.opGrantedMessages.next(opGrantedEvent);
          break;
        case 'RoomJoined':
          let roomJoinedEvent: RoomJoinedEvent = value;
          this.roomJoinedMessages.next(roomJoinedEvent);
          break;
        case 'RoomLeft':
          let roomLeftEvent: RoomLeftEvent = value;
          this.roomLeftMessages.next(roomLeftEvent);
          break;
        case 'VoiceGranted':
          let voiceGrantedEvent: VoiceGrantedEvent = value;
          this.voiceGrantedMessages.next(voiceGrantedEvent);
          break;
        case 'VoiceInRoomRequired':
          let voiceInRoomRequiredEvent: VoiceInRoomRequiredEvent = value;
          this.voiceInRoomRequiredMessages.next(voiceInRoomRequiredEvent);
          break;
      }
    });

    this.invitedOfRoomRequiredMessages
      .subscribe(invitedOfRoomRequired => this.handleInvitedOfRoomRequiredMessages(invitedOfRoomRequired));
    this.invitedToRoomMessages
      .subscribe(invitedToRoom => this.handleInvitedToRoomMessages(invitedToRoom));
    this.messageSentToRoomMessages
      .subscribe(messageSentToRoom => this.handleMessageSendToRoomMessages(messageSentToRoom));
    this.opGrantedMessages
      .subscribe(opGranted => this.handleOpGrantedMessages(opGranted));
    this.roomJoinedMessages
      .subscribe(roomJoined => this.handleRoomJoinedMessages(roomJoined));
    this.roomLeftMessages
      .subscribe(roomLeft => this.handleRoomLeftMessages(roomLeft));
    this.voiceGrantedMessages
      .subscribe(voiceGranted => this.handleVoiceGrantedMessages(voiceGranted));
    this.voiceInRoomRequiredMessages
      .subscribe(voiceInRoomRequired => this.handleVoiceInRoomRequiredMessages(voiceInRoomRequired));
  }

  handleInvitedOfRoomRequiredMessages(invitedOfRoomRequired: InvitedOfRoomRequiredEvent): void {
    let currentRooms = this.rooms.getValue();
    let roomIndex = currentRooms.findIndex((room => room.roomName === invitedOfRoomRequired.roomName));

    if (roomIndex !== -1) {
      if (currentRooms[roomIndex].users[this.currentUser.email]) {
        currentRooms[roomIndex].inviteRequired = invitedOfRoomRequired.inviteRequired;
      }
    }

    this.rooms.next(currentRooms);
  }

  handleInvitedToRoomMessages(invitedToRoom: InvitedToRoomEvent): void {
    let currentRooms = this.rooms.getValue();
    let roomIndex = currentRooms.findIndex((room => room.roomName === invitedToRoom.roomName));

    if (roomIndex !== -1) {
      currentRooms[roomIndex].invites[invitedToRoom.email] = invitedToRoom.invite;
    }

    this.rooms.next(currentRooms);
  }

  handleMessageSendToRoomMessages(messageSentToRoom: MessageSentToRoomEvent): void {
    // Todo
    // Better data structure would be a hast-table with room key and message arrays
    // same could be done for other room-specific information

    let chatMessage = new ChatMessage(messageSentToRoom.userName, messageSentToRoom.roomName, messageSentToRoom.message);
    let currentChatMessages = this.chatMessages.getValue();
    currentChatMessages.push(chatMessage);
    this.chatMessages.next(currentChatMessages);

    this.newChatMessage.next(chatMessage);

    console.log(this.rooms.getValue());
  }

  handleOpGrantedMessages(opGranted: OpGrantedEvent): void {
    let currentRooms = this.rooms.getValue();
    let roomIndex = currentRooms.findIndex((room => room.roomName === opGranted.roomName));

    if (roomIndex !== -1) {
      if (currentRooms[roomIndex].users[opGranted.email]) {
        currentRooms[roomIndex].ops[opGranted.email] = opGranted.op;
      }
    }

    this.rooms.next(currentRooms);
  }

  handleRoomJoinedMessages(roomJoined: RoomJoinedEvent): void {
    let currentRooms = this.rooms.getValue();

    let roomIndex = currentRooms.findIndex((room => room.roomName === roomJoined.roomName));

    if (roomIndex === -1) {
      let room = new Room(roomJoined.roomName);
      room.users[roomJoined.email] = roomJoined.name;
      currentRooms = [...currentRooms, room];
    } else {
      currentRooms[roomIndex].users[roomJoined.email] = roomJoined.name;
    }

    this.rooms.next(currentRooms);
  }

  handleRoomLeftMessages(roomLeft: RoomLeftEvent): void {
    let currentRooms = this.rooms.getValue();

    if (roomLeft.email !== this.currentUser.email) {
      let roomIndex = currentRooms.findIndex((room => room.roomName === roomLeft.roomName));
      delete currentRooms[roomIndex].users[roomLeft.email];

      this.rooms.next(currentRooms);
    }
  }

  handleVoiceGrantedMessages(voiceGranted: VoiceGrantedEvent): void {
    let currentRooms = this.rooms.getValue();
    let roomIndex = currentRooms.findIndex((room => room.roomName === voiceGranted.roomName));

    if (roomIndex !== -1) {
      if (currentRooms[roomIndex].users[voiceGranted.email]) {
        currentRooms[roomIndex].voices[voiceGranted.email] = voiceGranted.voice;
      }
    }

    this.rooms.next(currentRooms);
  }

  handleVoiceInRoomRequiredMessages(voiceInRoomRequired: VoiceInRoomRequiredEvent): void {
    let currentRooms = this.rooms.getValue();
    let roomIndex = currentRooms.findIndex((room => room.roomName === voiceInRoomRequired.roomName));

    if (roomIndex !== -1) {
      if (currentRooms[roomIndex].users[this.currentUser.email]) {
        currentRooms[roomIndex].voiceInRoomRequired = voiceInRoomRequired.voice;
      }
    }

    this.rooms.next(currentRooms);
  }

  joinRoom(roomName: string): void {
    let data = { "roomName": roomName };
    this.webSocketService.sendCommand('JoinRoom', data);
  }

  leaveRoom(roomName: string): void {
    let data = { "roomName": roomName };
    this.webSocketService.sendCommand('LeaveRoom', data);
  }

  sendMessageToRoom(roomName: string, message: string): void {
    let data = { "roomName": roomName, "message": message }
    this.webSocketService.sendCommand('SendMessageToRoom', data);
  }

  setInviteRoom(roomName: string, inviteRequired: boolean) {
    let data = { "roomName": roomName, "inviteRequired": inviteRequired }
    this.webSocketService.sendCommand('SetInviteRoom', data);
  }

  setVoiceRoom(roomName: string, voice: boolean) {
    let data = { "roomName": roomName, "voice": voice }
    this.webSocketService.sendCommand('SetVoiceRoom', data);
  }

  grantOp(roomName: string, email: string, op: boolean) {
    let data = { "roomName": roomName, "email": email, "op": op }
    this.webSocketService.sendCommand('GrantOp', data);
  }

  grantVoice(roomName: string, email: string, voice: boolean) {
    let data = { "roomName": roomName, "email": email, "voice": voice }
    this.webSocketService.sendCommand('GrantVoice', data);
  }

  inviteToRoom(roomName: string, email: string, invite: boolean) {
    let data = { "roomName": roomName, "email": email, "invite": invite }
    this.webSocketService.sendCommand('InviteToRoom', data);
  }

  getChatMessages(): Observable<ChatMessage[]> {
    return this.chatMessages.asObservable() as Observable<ChatMessage[]>
  }

  getNewChatMessage(): Observable<ChatMessage> {
    return this.newChatMessage.asObservable() as Observable<ChatMessage>;
  }
}