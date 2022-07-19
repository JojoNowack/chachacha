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

export interface KickedEvent extends RoomEvent {
  email: string;
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

export interface UserRenamedEvent extends UserEvent {
  name: string;
}

export interface UserDeletedEvent extends UserEvent {
  email: string;
}