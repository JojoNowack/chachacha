import { Injectable, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import {
  InvitedOfRoomRequiredEvent,
  InvitedToRoomEvent,
  MessageSentToRoomEvent,
  OpGrantedEvent,
  RoomJoinedEvent,
  RoomLeftEvent,
  VoiceGrantedEvent,
  VoiceInRoomRequiredEvent,
} from '../models/backend-event-types';
import { WebsocketService } from './websocket.service';
import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs";
import { UserService } from './user.service';
import { ChatMessage, Room, User } from '../models/chat-types';
import { time } from '../utils/time';
import { ResourceManagement } from '../utils/resourceManagement';

@Injectable({
  providedIn: 'root'
})
export class RoomService extends ResourceManagement implements OnDestroy {

  private readonly invitedOfRoomRequiredMessages = new ReplaySubject<InvitedOfRoomRequiredEvent>();
  private readonly invitedToRoomMessages = new ReplaySubject<InvitedToRoomEvent>();
  private readonly messageSentToRoomMessages = new ReplaySubject<MessageSentToRoomEvent>();
  private readonly opGrantedMessages = new ReplaySubject<OpGrantedEvent>();
  private readonly roomJoinedMessages = new ReplaySubject<RoomJoinedEvent>();
  private readonly roomLeftMessages = new ReplaySubject<RoomLeftEvent>();
  private readonly voiceGrantedMessages = new ReplaySubject<VoiceGrantedEvent>();
  private readonly voiceInRoomRequiredMessages = new ReplaySubject<VoiceInRoomRequiredEvent>();

  private readonly currentRoomName = new BehaviorSubject<string>("");
  private readonly currentChatMessages = new BehaviorSubject<ChatMessage[]>([]);
  private readonly newChatMessage = new ReplaySubject<ChatMessage>();

  private readonly rooms = new BehaviorSubject<Room[]>([]);

  /*
  private readonly roomNames = new BehaviorSubject<string[]>([]);
  private readonly roomMessages = new BehaviorSubject<{ [roomName: string]: ChatMessage[] }>({});
  private readonly roomUsers = new BehaviorSubject<{ [roomName: string]: User[] }>({});
  private readonly roomVoices = new BehaviorSubject<{ [roomName: string]: [email: string][] }>({});
  private readonly roomOps = new BehaviorSubject<{ [roomName: string]: [email: string][] }>({});
  private readonly roomInvites = new BehaviorSubject<{ [roomName: string]: [email: string][] }>({});
  private readonly roomInviteRequired = new BehaviorSubject<{ [roomName: string]: boolean }>({});
  private readonly roomVoiceInRoomRequired = new BehaviorSubject<{ [roomName: string]: boolean }>({});
   */

  loggedIn: boolean = false;
  currentUser: User = new User;

  constructor(private webSocketService: WebsocketService, private userService: UserService) {
    super();
    this.isLoggedIn();
    this.getUser();
    this.handleEvents();
  }

  // private appendValue<Type>(subject: BehaviorSubject<{[roomName: string]: Type[]}>, newValue: Type) {
  //   let currentValues = subject.getValue();
  //   currentValues[]


  //   let currentChatMessages = this.currentChatMessages.getValue();
  //   currentChatMessages.push(chatMessage);
  //   this.currentChatMessages.next(currentChatMessages);
  //   this.newChatMessage.next(chatMessage);
  // }

  ngOnDestroy(): void {
    this.destroy();
  }

  isLoggedIn(): void {
    this.userService
      .isLoggedIn()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(loggedIn => {
        this.loggedIn = loggedIn;
      });
  }

  getUser(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(user => {
        this.currentUser = user;
      })
  }

  private handleEvents() {
    const messages = this.webSocketService.getMessages();
    messages
      .pipe(takeUntil(this.preDestroy))
      .subscribe((message) => {
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
      .pipe(takeUntil(this.preDestroy))
      .subscribe(invitedOfRoomRequired => this.handleInvitedOfRoomRequiredMessages(invitedOfRoomRequired));
    this.invitedToRoomMessages
      .pipe(takeUntil(this.preDestroy))
      .subscribe(invitedToRoom => this.handleInvitedToRoomMessages(invitedToRoom));
    this.messageSentToRoomMessages
      .pipe(takeUntil(this.preDestroy))
      .subscribe(messageSentToRoom => this.handleMessageSendToRoomMessages(messageSentToRoom));
    this.opGrantedMessages
      .pipe(takeUntil(this.preDestroy))
      .subscribe(opGranted => this.handleOpGrantedMessages(opGranted));
    this.roomJoinedMessages
      .pipe(takeUntil(this.preDestroy))
      .subscribe(roomJoined => this.handleRoomJoinedMessages(roomJoined));
    this.roomLeftMessages
      .pipe(takeUntil(this.preDestroy))
      .subscribe(roomLeft => this.handleRoomLeftMessages(roomLeft));
    this.voiceGrantedMessages
      .pipe(takeUntil(this.preDestroy))
      .subscribe(voiceGranted => this.handleVoiceGrantedMessages(voiceGranted));
    this.voiceInRoomRequiredMessages
      .pipe(takeUntil(this.preDestroy))
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
    // Better data structure would be a hash-table with room key and message arraysgetCurrentDate
    // same could be done for other room-specific information

    let currentTime = time.getCurrentTime();
    let chatMessage = new ChatMessage(messageSentToRoom.userName, messageSentToRoom.message, currentTime);

    if (messageSentToRoom.userName === this.currentUser.userName) {
      chatMessage.setLabel("myChatMessage");
      this.appendNewMessage(chatMessage);
    } else {
      chatMessage.setLabel("notMyChatMessage");
      this.appendNewMessage(chatMessage);
    }
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

    if (roomJoined.email === this.currentUser.email) {
      this.currentRoomName.next(roomJoined.roomName);
    } else {

    }

    if (roomIndex === -1) {
      let room = new Room(roomJoined.roomName);
      room.users[roomJoined.email] = roomJoined.name;
      currentRooms = [...currentRooms, room];
    } else {
      currentRooms[roomIndex].users[roomJoined.email] = roomJoined.name;
    }

    let currentTime = time.getCurrentTime();
    let chatMessage = new ChatMessage("system", "" + roomJoined.name + " joined this room", currentTime, "systemMessage");
    this.appendNewMessage(chatMessage);
    this.rooms.next(currentRooms);
  }

  handleRoomLeftMessages(roomLeft: RoomLeftEvent): void {
    let currentRooms = this.rooms.getValue();
    let currentTime = time.getCurrentTime();

    if (roomLeft.email !== this.currentUser.email) {
      let roomIndex = currentRooms.findIndex((room => room.roomName === roomLeft.roomName));
      let chatMessage = new ChatMessage("system", roomLeft.email + " left this room", currentTime, "systemMessage");
      this.appendNewMessage(chatMessage);
      delete currentRooms[roomIndex].users[roomLeft.email];
      this.rooms.next(currentRooms);
    } else {
      this.currentRoomName.next("");
      let chatMessage = new ChatMessage("system", "You left this room", currentTime, "systemMessage");
      this.appendNewMessage(chatMessage);
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

  getCurrentRoomName(): Observable<string> {
    return this.currentRoomName.asObservable();
  }

  getCurrentChatMessages(): Observable<ChatMessage[]> {
    return this.currentChatMessages;
  }

  getNewChatMessage(): Observable<ChatMessage> {
    return this.newChatMessage.asObservable() as Observable<ChatMessage>;
  }

  getRooms(): Observable<Room[]> {
    return this.rooms.asObservable() as Observable<Room[]>;
  }

  private appendNewMessage(chatMessage: ChatMessage) {
    let currentChatMessages = this.currentChatMessages.getValue();
    currentChatMessages.push(chatMessage);
    this.currentChatMessages.next(currentChatMessages);
    this.newChatMessage.next(chatMessage);
  }
}
