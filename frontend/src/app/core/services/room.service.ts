import { Injectable, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import {
  InvitedOfRoomRequiredEvent,
  InvitedToRoomEvent,
  KickedEvent,
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
import { HomeModule } from 'src/app/home/home.module';

@Injectable()
export class RoomService extends ResourceManagement implements OnDestroy {

  private readonly kickedMessages = new ReplaySubject<KickedEvent>();
  private readonly invitedOfRoomRequiredMessages = new ReplaySubject<InvitedOfRoomRequiredEvent>();
  private readonly invitedToRoomMessages = new ReplaySubject<InvitedToRoomEvent>();
  private readonly messageSentToRoomMessages = new ReplaySubject<MessageSentToRoomEvent>();
  private readonly opGrantedMessages = new ReplaySubject<OpGrantedEvent>();
  private readonly roomJoinedMessages = new ReplaySubject<RoomJoinedEvent>();
  private readonly roomLeftMessages = new ReplaySubject<RoomLeftEvent>();
  private readonly voiceGrantedMessages = new ReplaySubject<VoiceGrantedEvent>();
  private readonly voiceInRoomRequiredMessages = new ReplaySubject<VoiceInRoomRequiredEvent>();

  // deprecated
  // private readonly rooms = new BehaviorSubject<Room[]>([]);

  private readonly currentRoomName = new BehaviorSubject<string>("");
  private readonly currentRoomNames = new BehaviorSubject<string[]>([]);
  private readonly currentChatMessages = new BehaviorSubject<ChatMessage[]>([]);
  private readonly currentUsers = new BehaviorSubject<{ email: string, name: string }[]>([]);
  private readonly currentVoices = new BehaviorSubject<{ email: string, voice: boolean }[]>([]);
  private readonly currentOps = new BehaviorSubject<{ email: string, op: boolean }[]>([]);
  private readonly currentInvites = new BehaviorSubject<{ email: string, invite: boolean }[]>([]);
  private readonly currentInviteRequired = new BehaviorSubject(false);
  private readonly currentVoiceInRoomRequired = new BehaviorSubject<boolean>(false);
  private readonly newChatMessage = new ReplaySubject<ChatMessage>();

  private readonly roomMessages = new BehaviorSubject<{ [roomName: string]: ChatMessage[] }>({});
  private readonly roomNotifications = new BehaviorSubject<{ [roomName: string]: number }>({});
  private readonly roomUsers = new BehaviorSubject<{ [roomName: string]: { email: string, name: string }[] }>({});
  private readonly roomVoices = new BehaviorSubject<{ [roomName: string]: { email: string, voice: boolean }[] }>({});
  private readonly roomOps = new BehaviorSubject<{ [roomName: string]: { email: string, op: boolean }[] }>({});
  private readonly roomInvites = new BehaviorSubject<{ [roomName: string]: { email: string, invite: boolean }[] }>({});
  private readonly roomInviteRequired = new BehaviorSubject<{ [roomName: string]: boolean }>({});
  private readonly roomVoiceInRoomRequired = new BehaviorSubject<{ [roomName: string]: boolean }>({});

  loggedIn: boolean = false;
  currentUser: User = new User;

  constructor(private webSocketService: WebsocketService, private userService: UserService) {
    super();
    this.isLoggedIn();
    this.getUser();
    this.handleEvents();
  }

  ngOnDestroy(): void {
    this.destroy();
    console.log("ngOnDestroy of RoomService");
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
        if (message !== undefined) {
          let data = JSON.parse(message.data);
          let type: string = data.type;
          let value = data.value;
          switch (type) {
            case 'Kicked':
              let kickedEvent: KickedEvent = value;
              this.kickedMessages.next(kickedEvent);
              break;
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
        }
      });

    this.kickedMessages
      .pipe(takeUntil(this.preDestroy))
      .subscribe(kicked => this.handleKickedMessages(kicked));
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

  private appendNewMessage(roomName: string, chatMessage: ChatMessage) {
    let currentRoomMessages = this.roomMessages.getValue();
    if (!currentRoomMessages[roomName]) {
      currentRoomMessages[roomName] = [];
    }
    currentRoomMessages[roomName].push(chatMessage);
    this.roomMessages.next(currentRoomMessages);
    this.newChatMessage.next(chatMessage);

    if (roomName === this.currentRoomName.getValue()) {
      this.currentChatMessages.next(currentRoomMessages[roomName]);
    } else {
      // message for other room
      let currentRoomNotifications = this.roomNotifications.getValue();
      if (!currentRoomNotifications[roomName]) {
        currentRoomNotifications[roomName] = 0;
      }
      let currentNotifications = currentRoomNotifications[roomName] + 1;
      currentRoomNotifications[roomName] = currentNotifications;
      this.roomNotifications.next(currentRoomNotifications);
    }
  }

  handleKickedMessages(kicked: KickedEvent): void {
    this.handleRoomLeftMessages({ roomName: kicked.roomName, email: kicked.email });
  }

  handleInvitedOfRoomRequiredMessages(invitedOfRoomRequired: InvitedOfRoomRequiredEvent): void {
    let currentInviteRequired = this.roomInviteRequired.getValue();
    currentInviteRequired[invitedOfRoomRequired.roomName] = invitedOfRoomRequired.inviteRequired;
    if (this.currentRoomName.getValue() === invitedOfRoomRequired.roomName) {
      this.currentInviteRequired.next(invitedOfRoomRequired.inviteRequired);
    }
    this.roomInviteRequired.next(currentInviteRequired);
  }

  handleInvitedToRoomMessages(invitedToRoom: InvitedToRoomEvent): void {
    let currentRoomInvites = this.roomInvites.getValue();
    let currentInvites = currentRoomInvites[invitedToRoom.roomName];
    let newInvite = { email: invitedToRoom.email, invite: invitedToRoom.invite };

    if (!currentInvites) {
      currentInvites = [newInvite];
    } else {

      let formerInvite = currentInvites.find((o, index) => {
        if (o.email === invitedToRoom.email) {
          currentInvites[index] = newInvite;
          return true;
        } else {
          return false;
        }
      });

      if (!formerInvite) {
        currentInvites.push(newInvite);
      }
    }
    if (this.currentRoomName.getValue() === invitedToRoom.roomName) {
      this.currentInvites.next(currentInvites);
    }
    currentRoomInvites[invitedToRoom.roomName] = currentInvites;
    this.roomInvites.next(currentRoomInvites);

    // systemMessage
    if (invitedToRoom.email === this.currentUser.email) {
      let currentTime = time.getCurrentTime();
      let content: string = "";
      if (invitedToRoom.invite) {
        content = "You are invited to join room: " + invitedToRoom.roomName;
      } else {
        content = "You are uninvited to join room: " + invitedToRoom.roomName;
      }
      let chatMessage = new ChatMessage("system", content, currentTime);
      chatMessage.setLabel("systemMessage");
      this.appendNewMessage("", chatMessage);
      // this.appendNewMessage(this.currentRoomName.getValue(), chatMessage);
    }
  }

  handleMessageSendToRoomMessages(messageSentToRoom: MessageSentToRoomEvent): void {
    let currentTime = time.getCurrentTime();
    let chatMessage = new ChatMessage(messageSentToRoom.userName, messageSentToRoom.message, currentTime);

    if (messageSentToRoom.userName === this.currentUser.userName) {
      chatMessage.setLabel("myChatMessage");
    } else {
      chatMessage.setLabel("notMyChatMessage");
    }
    this.appendNewMessage(messageSentToRoom.roomName, chatMessage);
  }

  handleOpGrantedMessages(opGranted: OpGrantedEvent): void {
    let currentRoomOps = this.roomOps.getValue();
    let currentOps = currentRoomOps[opGranted.roomName];
    let newOp = { email: opGranted.email, op: opGranted.op };

    if (!currentOps) {
      currentOps = [newOp];
    } else {

      let formerOp = currentOps.find((o, index) => {
        if (o.email === opGranted.email) {
          currentOps[index] = newOp;
          return true;
        } else {
          return false;
        }
      });

      if (!formerOp) {
        currentOps.push(newOp);
      }
    }
    if (this.currentRoomName.getValue() === opGranted.roomName) {
      this.currentOps.next(currentOps);
    }
    currentRoomOps[opGranted.roomName] = currentOps;
    this.roomOps.next(currentRoomOps);
  }

  handleRoomJoinedMessages(roomJoined: RoomJoinedEvent): void {
    // currentRoomUsers
    let currentRoomUsers = this.roomUsers.getValue();
    let currentUsers = currentRoomUsers[roomJoined.roomName];
    let newUser = { email: roomJoined.email, name: roomJoined.name };
    if (!currentUsers) {
      currentUsers = [];
    }
    let userIndex = currentUsers.findIndex((user => user.email === roomJoined.email));
    if (userIndex === -1) {
      currentUsers.push(newUser);
      currentRoomUsers[roomJoined.roomName] = currentUsers;
    }
    this.roomUsers.next(currentRoomUsers);

    // currentUsers
    if (this.currentRoomName.getValue() === roomJoined.roomName) {
      this.currentUsers.next(currentUsers);
    }

    // systemMessage
    let chatMessage: ChatMessage;
    let currentTime = time.getCurrentTime();
    if (roomJoined.email === this.currentUser.email) {
      chatMessage = new ChatMessage("system", "You joined this room", currentTime);

      // currentRoomNames
      let currentRoomNames = this.currentRoomNames.getValue();
      let roomIndex = currentRoomNames.findIndex((roomName => roomName === roomJoined.roomName));
      if (roomIndex === -1) {
        currentRoomNames.push(roomJoined.roomName);
        this.currentRoomNames.next(currentRoomNames);
      }

      // currentRoomName
      if (this.currentRoomName.getValue() !== roomJoined.roomName) {
        this.setCurrentRoom(roomJoined.roomName);
      }

    } else {
      chatMessage = new ChatMessage("system", roomJoined.name + " joined this room", currentTime);
    }
    chatMessage.setLabel("systemMessage");
    this.appendNewMessage(roomJoined.roomName, chatMessage);
  }

  handleRoomLeftMessages(roomLeft: RoomLeftEvent): void {
    // currentRoomUsers
    let currentRoomUsers = this.roomUsers.getValue();
    let currentUsers = currentRoomUsers[roomLeft.roomName];
    if (currentUsers) {
      currentUsers = currentUsers.filter(user => user.email !== roomLeft.email);
      if (currentUsers.length === 0 || roomLeft.email === this.currentUser.email) {
        delete currentRoomUsers[roomLeft.roomName];
      } else {
        currentRoomUsers[roomLeft.roomName] = currentUsers;
      }
    }
    this.roomUsers.next(currentRoomUsers);

    // currentUsers
    if (this.currentRoomName.getValue() === roomLeft.roomName) {
      this.currentUsers.next(currentUsers);
    }

    // systemMessage
    let chatMessage: ChatMessage;
    let currentTime = time.getCurrentTime();
    if (roomLeft.email === this.currentUser.email) {
      // chatMessage = new ChatMessage("system", "You left this room", currentTime);

      // currentRoomNames
      let currentRoomNames = this.currentRoomNames.getValue();
      currentRoomNames = currentRoomNames.filter(roomName => roomName !== roomLeft.roomName);
      this.currentRoomNames.next(currentRoomNames);

      // currentRoomName
      if (this.currentRoomName.getValue() === roomLeft.roomName) {
        this.setCurrentRoom("");
      }

    } else {
      chatMessage = new ChatMessage("system", roomLeft.email + " left this room", currentTime);
      chatMessage.setLabel("systemMessage");
      this.appendNewMessage(roomLeft.roomName, chatMessage);
    }
    // chatMessage.setLabel("systemMessage");
    // this.appendNewMessage(roomLeft.roomName, chatMessage);
  }

  handleVoiceGrantedMessages(voiceGranted: VoiceGrantedEvent): void {
    let currentRoomVoices = this.roomVoices.getValue();
    let currentVoices = currentRoomVoices[voiceGranted.roomName];
    let newVoice = { email: voiceGranted.email, voice: voiceGranted.voice };

    if (!currentVoices) {
      currentVoices = [newVoice];
    } else {

      let formerVoice = currentVoices.find((o, index) => {
        if (o.email === voiceGranted.email) {
          currentVoices[index] = newVoice;
          return true;
        } else {
          return false;
        }
      });

      if (!formerVoice) {
        currentVoices.push(newVoice);
      }
    }
    if (this.currentRoomName.getValue() === voiceGranted.roomName) {
      this.currentVoices.next(currentVoices);
    }
    currentRoomVoices[voiceGranted.roomName] = currentVoices;
    this.roomVoices.next(currentRoomVoices);
  }

  handleVoiceInRoomRequiredMessages(voiceInRoomRequired: VoiceInRoomRequiredEvent): void {
    let currentVoiceInRoomRequired = this.roomVoiceInRoomRequired.getValue();
    currentVoiceInRoomRequired[voiceInRoomRequired.roomName] = voiceInRoomRequired.voice;
    if (this.currentRoomName.getValue() === voiceInRoomRequired.roomName) {
      this.currentVoiceInRoomRequired.next(voiceInRoomRequired.voice);
    }
    this.roomVoiceInRoomRequired.next(currentVoiceInRoomRequired);
  }

  kick(roomName: string, email: string) {
    let data = { "roomName": roomName, "email": email };
    this.webSocketService.sendCommand('Kick', data);
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

  getCurrentRoomNames(): Observable<string[]> {
    return this.currentRoomNames.asObservable();
  }

  getCurrentChatMessages(): Observable<ChatMessage[]> {
    return this.currentChatMessages;
  }

  getNewChatMessage(): Observable<ChatMessage> {
    return this.newChatMessage.asObservable();
  }

  getCurrentUsers(): Observable<{ email: string, name: string }[]> {
    return this.currentUsers.asObservable();
  }

  getCurrentVoices(): Observable<{ email: string, voice: boolean }[]> {
    return this.currentVoices.asObservable();
  }

  getCurrentOps(): Observable<{ email: string, op: boolean }[]> {
    return this.currentOps.asObservable();
  }

  getCurrentInvites(): Observable<{ email: string, invite: boolean }[]> {
    return this.currentInvites.asObservable();
  }

  getCurrentInvitesRequired(): Observable<boolean> {
    return this.currentInviteRequired.asObservable();
  }

  getCurrentVoiceInRoomRequired(): Observable<boolean> {
    return this.currentVoiceInRoomRequired.asObservable();
  }

  getRoomNotifications(): Observable<{ [roomName: string]: number }> {
    return this.roomNotifications.asObservable();
  }

  // getRooms(): Observable<Room[]> {
  //   return this.rooms.asObservable() as Observable<Room[]>;
  // }

  setCurrentRoom(newRoomName: string): void {
    this.currentRoomName.next(newRoomName);

    let currentRoomMessages = this.roomMessages.getValue();
    let currentRoomUsers = this.roomUsers.getValue();
    let currentRoomVoices = this.roomVoices.getValue();
    let currentRoomOps = this.roomOps.getValue();
    let currentRoomInvites = this.roomInvites.getValue();
    let currentRoomInviteRequired = this.roomInviteRequired.getValue();
    let currentRoomVoiceInRoomRequired = this.roomVoiceInRoomRequired.getValue();
    let currentRoomNotifications = this.roomNotifications.getValue();

    if (!currentRoomMessages[newRoomName]) {
      currentRoomMessages[newRoomName] = [];
    }
    if (!currentRoomUsers[newRoomName]) {
      currentRoomUsers[newRoomName] = [];
    }
    if (!currentRoomVoices[newRoomName]) {
      currentRoomVoices[newRoomName] = [];
    }
    if (!currentRoomOps[newRoomName]) {
      currentRoomOps[newRoomName] = [];
    }
    if (!currentRoomInvites[newRoomName]) {
      currentRoomInvites[newRoomName] = [];
    }
    if (!currentRoomInviteRequired[newRoomName]) {
      currentRoomInviteRequired[newRoomName] = false;
    }
    if (!currentRoomVoiceInRoomRequired[newRoomName]) {
      currentRoomVoiceInRoomRequired[newRoomName] = false;
    }
    currentRoomNotifications[newRoomName] = 0;

    this.currentChatMessages.next(currentRoomMessages[newRoomName]);
    this.currentUsers.next(currentRoomUsers[newRoomName]);
    this.currentVoices.next(currentRoomVoices[newRoomName]);
    this.currentOps.next(currentRoomOps[newRoomName]);
    this.currentInvites.next(currentRoomInvites[newRoomName]);
    this.currentInviteRequired.next(currentRoomInviteRequired[newRoomName]);
    this.currentVoiceInRoomRequired.next(currentRoomVoiceInRoomRequired[newRoomName]);
    this.roomNotifications.next(currentRoomNotifications);
  }
}
