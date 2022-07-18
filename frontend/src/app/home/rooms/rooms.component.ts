import {Component, OnDestroy, OnInit} from '@angular/core';
import {RoomService} from "../../core/services/room.service";
import {ChatMessage, Room} from "../../core/models/chat-types";
import {ResourceManagement} from 'src/app/core/utils/resourceManagement';
import {takeUntil} from 'rxjs';
import {UserService} from 'src/app/core/services/user.service';
import {DialogChangePasswordComponent} from "../dialoges/dialog-change-password/dialog-change-password.component";
import {ComponentType} from "@angular/cdk/overlay";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogInviteToRoomComponent} from "../dialoges/dialog-invite-to-room/dialog-invite-to-room.component";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent extends ResourceManagement implements OnInit, OnDestroy {

  rooms: Room[] = [];
  currentRoomNames: string[] = [];
  currentRoomName: string = "";
  currentUser: { email: string, name: string } = {email: "", name: ""};
  newRoomName: string = "";
  inviteEmail: string = "";
  currentOp: boolean = false;
  currentInviteRequired: boolean = false;
  currentVoiceInRoomRequired: boolean = false;
  newChatMessage = new ChatMessage();
  roomNotifications: { [roomName: string]: number } = {};

  constructor(private userService: UserService, private roomService: RoomService,private myDialog: MatDialog ) {
    super();
  }

  ngOnInit(): void {
    this.getCurrentRoomNames();
    this.getCurrentRoomName();
    this.getCurrentUser();
    this.getCurrentOps();
    this.getCurrentInvitesRequired();
    this.getCurrentVoiceInRoomRequired();
    this.getNewChatMessage();
    this.getRoomNotifications();

    //wenn man testet
    if (true) {
      setTimeout(() => {
        this.roomService.joinRoom("Sportgruppe")
      }, 1000);
      setTimeout(() => {
        this.roomService.joinRoom("Schachgruppe")
      }, 1000);
      setTimeout(() => {
        this.roomService.joinRoom("Mathe")
      }, 1000);
      setTimeout(() => {
        this.roomService.joinRoom("Theo")
      }, 1000);
      setTimeout(() => {
        this.roomService.sendMessageToRoom("Theo", "Hi");
      }, 1500);
      setTimeout(() => {
        this.roomService.sendMessageToRoom("Theo", "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec mollis. Quisque convallis libero in sapien pharetra tincidunt. Aliquam elit ante, malesuada id, tempor eu, gravida id, odio. Maecenas suscipit, risus et eleifend imperdiet, nisi orci ullamcorper massa, et adipiscing orci velit quis magna.");
      }, 1500);
      setTimeout(() => {
        this.roomService.sendMessageToRoom("Theo", "Praesent sit amet ligula id orci venenatis auctor. Phasellus porttitor, metus non tincidunt dapibus, orci pede pretium neque, sit amet adipiscing ipsum lectus et libero. Aenean bibendum. Curabitur mattis quam id urna. Vivamus dui. Donec nonummy lacinia lorem.");
      }, 1600);
      setTimeout(() => {
        this.roomService.sendMessageToRoom("Theo", "Cras risus arcu, sodales ac, ultrices ac, mollis quis, justo. Sed a libero. Quisque risus erat, posuere at, tristique non, lacinia quis, eros.");
      }, 1700);
      setTimeout(() => {
        this.roomService.sendMessageToRoom("Theo", "Cras volutpat, lacus quis semper pharetra, nisi enim dignissim est, et sollicitudin quam ipsum vel mi. Sed commodo urna ac urna. Nullam eu tortor. Curabitur sodales scelerisque magna. Donec ultricies tristique pede. Nullam libero. Nam sollicitudin felis vel metus. Nullam posuere molestie metus. Nullam molestie, nunc id suscipit rhoncus, felis mi vulputate lacus, a ultrices tortor dolor eget augue. Aenean ultricies felis ut turpis. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse placerat tellus ac nulla. Proin adipiscing sem ac risus. Maecenas nisi. Cras semper.");
      }, 1800);
      setTimeout(() => {
        this.roomService.sendMessageToRoom("Theo", "Cras volutpat, lacus quis semper pharetra, nisi enim dignissim est, et sollicitudin quam ipsum vel mi. Sed commodo urna ac urna. Nullam eu tortor. Curabitur sodales scelerisque magna. Donec ultricies tristique pede. Nullam libero. Nam sollicitudin felis vel metus. Nullam posuere molestie metus. Nullam molestie, nunc id suscipit rhoncus, felis mi vulputate lacus, a ultrices tortor dolor eget augue. Aenean ultricies felis ut turpis. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse placerat tellus ac nulla. Proin adipiscing sem ac risus. Maecenas nisi. Cras semper.");
      }, 1800);
      setTimeout(() => {
        this.roomService.sendMessageToRoom("Theo", "Cras volutpat, lacus quis semper pharetra, nisi enim dignissim est, et sollicitudin quam ipsum vel mi. Sed commodo urna ac urna. Nullam eu tortor. Curabitur sodales scelerisque magna. Donec ultricies tristique pede. Nullam libero. Nam sollicitudin felis vel metus. Nullam posuere molestie metus. Nullam molestie, nunc id suscipit rhoncus, felis mi vulputate lacus, a ultrices tortor dolor eget augue. Aenean ultricies felis ut turpis. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse placerat tellus ac nulla. Proin adipiscing sem ac risus. Maecenas nisi. Cras semper.");
      }, 1800);
      setTimeout(() => {
        this.roomService.sendMessageToRoom("Theo", "Cras volutpat, lacus quis semper pharetra, nisi enim dignissim est, et sollicitudin quam ipsum vel mi. Sed commodo urna ac urna. Nullam eu tortor. Curabitur sodales scelerisque magna. Donec ultricies tristique pede. Nullam libero. Nam sollicitudin felis vel metus. Nullam posuere molestie metus. Nullam molestie, nunc id suscipit rhoncus, felis mi vulputate lacus, a ultrices tortor dolor eget augue. Aenean ultricies felis ut turpis. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse placerat tellus ac nulla. Proin adipiscing sem ac risus. Maecenas nisi. Cras semper.");
      }, 1800);

    }
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  getCurrentRoomNames(): void {
    this.roomService
      .getCurrentRoomNames()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(currentRoomNames => {
        this.currentRoomNames = currentRoomNames;
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

  getCurrentUser(): void {
    this.userService.getUser()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(user => {
        this.currentUser = {email: user.email, name: user.userName};
      })
  }

  getCurrentOps(): void {
    this.roomService
      .getCurrentOps()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(opArray => {
        let currentOp = opArray.filter(user => user.email === this.currentUser.email);
        if (currentOp.length !== 0) {
          this.currentOp = currentOp[0].op;
        }
      })
  }

  getCurrentInvitesRequired(): void {
    this.roomService
      .getCurrentInvitesRequired()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(currentInviteRequired => {
        this.currentInviteRequired = currentInviteRequired;
      })
  }

  getCurrentVoiceInRoomRequired(): void {
    this.roomService
      .getCurrentVoiceInRoomRequired()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(currentVoiceInRoomRequired => {
        this.currentVoiceInRoomRequired = currentVoiceInRoomRequired;
      })
  }

  getRoomNotifications(): void {
    this.roomService
      .getRoomNotifications()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(roomNotifications => {
        this.roomNotifications = roomNotifications;
      })
  }

  getNewChatMessage(): void {
    this.roomService
      .getNewChatMessage()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(newChatMessage => {
        this.newChatMessage = newChatMessage;
      })
  }

  onSubmit(event: any) {
    if (event.submitter.name === "newRoom" && this.newRoomName !== "") {
      this.roomService.joinRoom(this.newRoomName);
    }
    this.newRoomName = "";
  }

  clickedCurrentRoom(clickedRoomName: string): void {
    this.roomService.setCurrentRoom(clickedRoomName);
  }

  leaveItemClicked(roomName: string) {
    this.roomService.leaveRoom(roomName);
    //this.selectedMenu = menuItem.menuLinkText;
  }

  setVoiceButtonClicked(roomName: string, voice: boolean) {
    this.roomService.setVoiceRoom(roomName, voice);
  }

  setInviteRoomButtonClicked(roomName: string, inviteRequired: boolean) {
    this.roomService.setInviteRoom(roomName, inviteRequired);
  }

  inviteToRoomItemClicked(roomName: string, invite: boolean) {

    this.openDialog(DialogInviteToRoomComponent);
    console.log("inviteToRoomItemClicked");

  }

  openDialog(myCustomDialog: ComponentType<any>) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    this.myDialog.open(myCustomDialog, dialogConfig);
  }
}
