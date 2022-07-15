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

export class ChatMessage {
  private static counter: number = 0;
  userName: string;
  content: string;
  label?: string;
  readonly id?: number;
  ack: boolean;

  constructor(userName: string, content: string, public date: string, label?: string, ack: boolean = false) {
    this.userName = userName;
    this.content = content;
    this.label = label;
    this.id = ChatMessage.counter++;
    this.ack = ack;
  }

  setLabel(label: string) {
    this.label = label;
  }
}