import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from "../../core/services/user.service";
import { RoomService } from "../../core/services/room.service";
import { ChatMessage, Room, User } from "../../core/models/chat-types";
import { takeUntil } from 'rxjs/operators';
import { ResourceManagement } from 'src/app/core/utils/resourceManagement';
import { time } from 'src/app/core/utils/time';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent extends ResourceManagement implements OnInit, OnDestroy {

  chatMessages: ChatMessage[] =
    [
      new ChatMessage("phe", "Hello World", time.getCurrentTime(), "myChatMessage"),
      new ChatMessage("system", "u1 Joined", time.getCurrentTime(), "systemMessage"),
      new ChatMessage("u1", "Servus World", time.getCurrentTime(), "notMyChatMessage"),
      new ChatMessage("u1", "Chachacha", time.getCurrentTime(), "notMyChatMessage"),
      new ChatMessage("u1", "Chachacha", time.getCurrentTime(), "notMyChatMessage"),
      new ChatMessage("u1", "Chachacha", time.getCurrentTime(), "myChatMessage"),
      new ChatMessage("u1", "Chachacha", time.getCurrentTime(), "notMyChatMessage"),
      new ChatMessage("u1", "Chachacha", time.getCurrentTime(), "notMyChatMessage"),
      new ChatMessage("u1", "Chachacha", time.getCurrentTime(), "notMyChatMessage"),
      new ChatMessage("u1", "Chachacha", time.getCurrentTime(), "notMyChatMessage"),

      new ChatMessage("phe", "Heute nicht", time.getCurrentTime(), "myChatMessage"),
      new ChatMessage("phe", "Morgen?", time.getCurrentTime(), "myChatMessage"),
      new ChatMessage("u1", "Tanzen?", time.getCurrentTime(), "notMyChatMessage")
    ];

  textInput: string = "";
  currentUser: User = new User;
  loggedIn: boolean = false;
  currentRoomName: string = "";
  currentChatMessages: ChatMessage[] = [];
  // chatMessages: ChatMessage[] = [];
  // rooms: Room[] = [new Room("Schatz")];

  constructor(private roomService: RoomService, private userService: UserService) {
    super();
  }

  ngOnInit(): void {
    this.isLoggedIn();
    this.getUser();
    this.getCurrentRoomName();
    this.getCurrentChatMessages();
    // this.getNewChatMessage();
    // this.getRooms();
  }

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

  getCurrentRoomName(): void {
    this.roomService
      .getCurrentRoomName()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(currentRoomName => {
        this.currentRoomName = currentRoomName;
      })
  }

  getCurrentChatMessages(): void {
    this.roomService
      .getCurrentChatMessages()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(currentChatMessages => {
        this.currentChatMessages = currentChatMessages;
      })
  }

  // future possibilty to only append new message in view
  getNewChatMessage(): void {
    this.roomService
      .getNewChatMessage()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(newChatMessage => {
        this.chatMessages.push(newChatMessage);
      })
  }

  // getRooms(): void {
  //   this.roomService
  //     .getRooms()
  //     .pipe(takeUntil(this.preDestroy))
  //     .subscribe(rooms => {
  //       this.rooms = rooms;
  //       console.log("rooms hat sich geändert");
  //       console.log(this.rooms);
  //     })
  // }

  onSubmit(event: any) {
    console.log("button was pushed and this text was sent: " + this.textInput);
    if (this.currentRoomName === "") {
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
      this.roomService.sendMessageToRoom(this.currentRoomName, this.textInput);
      this.textInput = "";
    }
  }
}
