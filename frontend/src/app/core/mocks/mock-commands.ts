import { Command } from "../models/backend-event-types";

// JoinRoom: Betritt einen Raum
// LeaveRoom: Verlässt einen Raum
// SendMessageToRoom: Sendet Nachricht an Raum
// SetInviteRoom: Definiert für einen Raum, ob eine Einladung erforderlich ist
// SetVoiceRoom: Definiert, ob ein Raum moderiert ist, d.h. ob nur Personen mit Voice im Raum sprechen können.
// GrantOp: Gibt einer Person im Raum Operator Rechte
// GrantVoice: Gibt einer Person im Raum Voice
// InviteToRoom: Spricht eine Einladung für einen Raum aus.
// ChangeUserPassword: Setzt das Password neu.
// Login: Logged sich als User ein.
// Logout: Logged sich aus.
// RegisterUser: Registriert einen neuen User.
// RenameUser: Benennt den aktuellen Nutzer um.

export const COMMANDS: Command[] = [
  { type: "JoinRoom", template: { "roomName": "test" } },
  { type: "LeaveRoom", template: { "roomName": "test" } },
  {
    type: "SendMessageToRoom", template: {
      "roomName": "test",
      "message": "Huhu, dies ist ein Nachricht!"
    }
  },
  {
    type: "SetInviteRoom", template: {
      "roomName": "test",
      "inviteRequired": true
    }
  },
  {
    type: "SetVoiceRoom", template: {
      "roomName": "test",
      "voice": true
    }
  },
  {
    type: "GrantOp", template: {
      "roomName": "test",
      "email": "phe@test.de",
      "op": true
    }
  },
  {
    type: "GrantVoice", template: {
      "roomName": "test",
      "email": "phe@test.de",
      "voice": true
    }
  },
  {
    type: "InviteToRoom", template: {
      "roomName": "test",
      "email": "phe@test.de",
      "invite": true
    }
  },
  {
    type: "ChangeUserPassword", template: {
      "email": "phe@test.de",
      "oldPassword": "1234",
      "newPassword": "123"
    }
  },
  {
    type: "Login", template: {
      password: "1234",
      email: "phe@test.de"
    }
  },
  { type: "Logout", template: {} },
  {
    type: "RegisterUser", template: {
      "email": "phe@test.de",
      "name": "phe",
      "password": "1234"
    }
  },
  {
    type: "RenameUser", template: {
      "email": "phe@test.de",
      "userName": "phe second name"
    }
  },
];