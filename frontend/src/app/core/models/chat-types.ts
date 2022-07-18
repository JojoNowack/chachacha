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

// deprecated
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
  userName: string;
  content: string;
  date?: string;
  label?: string;

  constructor(userName: string = "", content: string = "", date?: string, label?: string) {
    this.userName = userName;
    this.content = content;
    this.date = date;
    this.label = label;
  }

  setLabel(label: string) {
    this.label = label;
  }

  isEmpty(): boolean {
    if (this.userName === "" && this.content === "") {
      return true;
    } else {
      return false;
    }
  }
}