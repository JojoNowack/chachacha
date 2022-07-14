import {Component, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {RoomService} from "../room.service";
import {ChatMessage, Room, User} from "../types";
import {BehaviorSubject} from "rxjs";


@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.css']
})
export class MessageFormComponent implements OnInit {
//chatMessages: ChatMessage[] =[];
  chatMessages: ChatMessage[] = [new ChatMessage("phe", "Schatz", "Hello World", this.roomService.getCurrentDate(), "myChatMessage"),
    new ChatMessage("system", "Schatz", "u1 Joined", this.roomService.getCurrentDate(), "systemMessage"),
    new ChatMessage("u1", "Schatz", "Ende World", this.roomService.getCurrentDate(), "notMyChatMessage")];

  textInput: string = "";
  currentUser: User = new User;
  loggedIn: boolean = false;
  rooms: Room[] = [new Room("Schatz")];

  constructor(private roomService: RoomService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.isLoggedIn();
    this.getUser();
    // this.getChatMessages();
    this.getNewChatMessage();
    this.getRooms();
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
      //todo wird schon in room service gemacht
      if (newChatMessage.userName === this.currentUser.userName) {
        newChatMessage.setLabel("myChatMessage");
      } else {
        if (newChatMessage.label !== "") {
//if there is a label let it be
        } else {
          newChatMessage.setLabel("notMyChatMessage");
        }
      }
      this.chatMessages.push(newChatMessage);
    })
  }

//todo weg?
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
    const roomName: string = this.roomService.getCurrentRoomName(); // todo get the real room
    if (roomName === "") {
      console.log("no room selected");
    } else {


      //const email: string = "u1@test.de";
      //const invite: boolean = true;
      //this.roomService.joinRoom(roomName);
      //this.roomService.setInviteRoom("test", true);
      //this.roomService.inviteToRoom(roomName, email, invite);
      // this.roomService.setVoiceRoom(roomName, true);
      // this.roomService.grantVoice(roomName, "phe@test.de", false);
      // this.roomService.grantOp(roomName, "u1@test.de", false);
      this.roomService.sendMessageToRoom(roomName, this.textInput);
      this.textInput = "";
    }
  }

  getCurrentRoomName(): string {
    return this.roomService.getCurrentRoomName();
  }


  private getRooms() {
    this.roomService.getRooms().subscribe(rooms => {
      this.rooms = rooms;
      console.log("rooms hat sich geändert");
      console.log(this.rooms);
    })
  }

  getMessagesforCurrentRoom() {
    //todo anders ?

  }
}
