import {Component, OnDestroy, OnInit} from '@angular/core';
import {RoomService} from "../../core/services/room.service";
import {Room} from "../../core/models/chat-types";
import {ResourceManagement} from 'src/app/core/utils/resourceManagement';
import {takeUntil} from 'rxjs';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent extends ResourceManagement implements OnInit, OnDestroy {

  rooms: Room[] = [];
  newRoomName: string = "";

  constructor(private roomService: RoomService) {
    super();
  }

  ngOnInit(): void {
    this.getRooms();

    // this.rooms.push(new Room("Schatz"));
    // this.rooms.push(new Room("Freunde"));
    // this.rooms.push(new Room("Familie"));
    //setTimeout(() => {
    //  this.roomService.joinRoom("Sportgruppe")
    //}, 1000);
    // setTimeout(() => {
    //   this.roomService.joinRoom("Schachgruppe")
    // }, 1000);
    // setTimeout(() => {
    //   this.roomService.joinRoom("Theo")
    // }, 1000);

  }

  ngOnDestroy(): void {
    this.destroy();
  }

  getRooms(): void {
    this.roomService
      .getRooms()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(rooms => {
        this.rooms = rooms;
      })
  }

  onSubmit(event: any) {
    if (event.submitter.name === "newRoom" && this.newRoomName !== "") {
      this.roomService.joinRoom(this.newRoomName);
    }
  }

  leaveItemClicked(roomName: string) {
    console.log("leave " + roomName);
    this.roomService.leaveRoom(roomName);

    //this.selectedMenu = menuItem.menuLinkText;
  }


  setVoiceButtonClicked(roomName: string, voice: boolean) {
    this.roomService.setVoiceRoom(roomName, voice);
  }

  setInviteRoomButtonClicked(roomName: string, inviteRequired: boolean) {
    this.roomService.setInviteRoom(roomName, inviteRequired);
  }
}
