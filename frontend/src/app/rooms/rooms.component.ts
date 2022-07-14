import {Component, OnInit} from '@angular/core';
import {RoomService} from "../room.service";
import {Room} from "../types";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  //todo mit room service verbinden?
  readonly rooms: Room[] = [];
  newRoomName: string = "";
  constructor(private roomService: RoomService) {
  }

  ngOnInit(): void {
    //to satisfy linting ;)
    console.log("RoomsComponent is started");
    this.rooms.push(new Room("Schatz"));
    this.rooms.push(new Room("Freunde"));
    this.rooms.push(new Room("Familie"));

  }

  onSubmit(event: any) {
    if (event.submitter.name === "newRoom") {
      console.log("todo new room");
      this.rooms.push(new Room(this.newRoomName));
    } else {
      //todo eigene methode machen @jojo
      //console.log(event.submitter);
      if (event.submitter.name !== "") {
        this.roomService.joinRoom(event.submitter.name);
      }
    }
  }

  leaveItemClicked(roomName: string) {
    console.log("leave " + roomName);
    this.roomService.leaveRoom(roomName);

    //this.selectedMenu = menuItem.menuLinkText;
  }
}
