import { Component, OnInit } from '@angular/core';
import { UserService } from "../user.service";
import { RoomService } from "../room.service";
import { ChatMessage, User } from "../types";


@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.css']
})
export class MessageFormComponent implements OnInit {

  chatMessages: ChatMessage[] = [];

  textInput: string = "";
  currentUser: User = new User;
  loggedIn: boolean = false;

  constructor(private roomService: RoomService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.isLoggedIn();
    this.getUser();
    // this.getChatMessages();
    this.getNewChatMessage();
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

  getNewChatMessage(): void {
    this.roomService.getNewChatMessage().subscribe(newChatMessage => {
      if (newChatMessage.userName === this.currentUser.userName) {
        newChatMessage.setLabel("myChatMessage");
      } else {
        newChatMessage.setLabel("notMyChatMessage");
      }
      this.chatMessages.push(newChatMessage);
    })
  }

  getChatMessages(): void {
    this.roomService.getChatMessages().subscribe(chatMessages => {
      this.chatMessages = chatMessages;
      this.chatMessages.forEach((chatMessage) => {

        if (chatMessage.userName === this.currentUser.userName) {
          chatMessage.setLabel("myChatMessage");
        } else {
          chatMessage.setLabel("notMyChatMessage");
        }
      });
      console.log(this.chatMessages)
    });
  }

  onSubmit(event: any) {
    console.log("button was pushed and this text was sent: " + this.textInput);
    const roomName: string = "test"; // todo get the real room
    const email: string = "u1@test.de";
    const invite: boolean = true;
    this.roomService.joinRoom(roomName);
    this.roomService.setInviteRoom("test", true);
    this.roomService.inviteToRoom(roomName, email, invite);
    // this.roomService.setVoiceRoom(roomName, true);
    // this.roomService.grantVoice(roomName, "phe@test.de", false);
    // this.roomService.grantOp(roomName, "u1@test.de", false);
    this.roomService.sendMessageToRoom(roomName, this.textInput);
    this.textInput = "";
  }
}