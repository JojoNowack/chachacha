import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from "../../core/services/user.service";
import { RoomService } from "../../core/services/room.service";
import { ChatMessage, Room, User } from "../../core/models/chat-types";
import { takeUntil } from 'rxjs/operators';
import { ResourceManagement } from 'src/app/core/utils/resourceManagement';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent extends ResourceManagement implements OnInit, OnDestroy {

  textInput: string = "";
  currentUser: User = new User;
  loggedIn: boolean = false;
  currentRoomName: string = "";
  currentChatMessages: ChatMessage[] = [];
  chatMessages: ChatMessage[] = [];

  constructor(private roomService: RoomService, private userService: UserService) {
    super();
  }

  ngOnInit(): void {
    this.isLoggedIn();
    this.getUser();
    this.getCurrentRoomName();
    this.getCurrentChatMessages();
    // this.getNewChatMessage();
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

  onSubmit(event: any) {
    if (this.currentRoomName !== "") {
      this.roomService.sendMessageToRoom(this.currentRoomName, this.textInput);
      this.textInput = "";
    }
  }
}
