export class User {
  id: number;
  email: string;
  userName: string;
  token: string;
  newSha1PWH?: string;

  constructor(id: number = -1, email: string = "", userName: string = "", token: string = "", newSha1PWH?: string) {
    this.id = id;
    this.email = email;
    this.userName = userName;
    this.token = token;
    this.newSha1PWH = newSha1PWH;
  }

  isEmpty(): boolean {
    if (this.id === -1) {
      return true;
    } else {
      return false;
    }
  }

  equals(user: User): boolean {
    if (this.email === user.email && this.userName === user.userName) {
      return true;
    } else {
      return false;
    }
  }
}

//public im constructor davor und dann kann man sich das doppelte sparen glaub ich
export class Room {
  roomName: string;
  users: { [email: string]: string };
  voices: { [email: string]: boolean };
  ops: { [email: string]: boolean };
  invites: { [email: string]: boolean };
  inviteRequired: boolean;
  voiceInRoomRequired: boolean;
  messages: ChatMessage[];

  constructor(roomName: string,
              users: { [email: string]: string } = {},
              voices: { [email: string]: boolean } = {},
              ops: { [email: string]: boolean } = {},
              invites: { [email: string]: boolean } = {},
              inviteRequired: boolean = false,
              voiceInRoomRequired: boolean = false,
              messages: ChatMessage[] = []) {

    this.roomName = roomName;
    this.users = users;
    this.voices = voices;
    this.ops = ops;
    this.invites = invites;
    this.inviteRequired = inviteRequired;
    this.voiceInRoomRequired = voiceInRoomRequired;
    this.messages = messages;
  }
}

// Todo @jojo
// Make flat, {[roomName]: ChatMessage[]}, ...

export class ChatMessage {
  private static counter: number = 0;
  userName: string;
  roomName: string;
  content: string;
  label?: string;
  readonly id?: number;
  ack: boolean;

  constructor(userName: string, roomName: string, content: string, public date: string, label?: string, ack: boolean = false) {
    this.userName = userName;
    this.roomName = roomName;
    this.content = content;
    this.label = label;
    this.id = ChatMessage.counter++;
    this.ack = ack;
  }

  setLabel(label: string) {
    this.label = label;
  }
}

export interface Command {
  type: string;
  template: {};
}

export interface SocketIdEvent {
  id: number;
}

export interface RoomEvent {
  roomName: string;
}

export interface InvitedOfRoomRequiredEvent extends RoomEvent {
  inviteRequired: boolean;
}

export interface InvitedToRoomEvent extends RoomEvent {
  email: string;
  invite: boolean;
}

export interface MessageSentToRoomEvent extends RoomEvent {
  email: string;
  message: string;
  userName: string;
}

export interface OpGrantedEvent extends RoomEvent {
  op: boolean;
  email: string;
}

export interface RoomJoinedEvent extends RoomEvent {
  email: string;
  name: string;
}

export interface RoomLeftEvent extends RoomEvent {
  email: string;
}

export interface VoiceGrantedEvent extends RoomEvent {
  voice: boolean;
  email: string;
}

export interface VoiceInRoomRequiredEvent extends RoomEvent {
  voice: boolean;
}

export interface UserEvent {
  id: number;
  email: string;
}

export interface ChangeUserPasswordEvent extends UserEvent {
  newSha1PWH: string;
}

export interface ChangePasswordFailedEvent extends UserEvent {
}

export interface LoggedInEvent extends UserEvent {
  name: string;
  token: string;
}

export interface LoggedOutEvent extends UserEvent {
}

export interface LogginFailedEvent extends UserEvent {
}

export interface UserRegisteredEvent extends UserEvent {
  name: string;
  newSha1PWH: string;
}

export interface UserRenameEvent extends UserEvent {
  userName: string;
}
