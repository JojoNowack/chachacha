import {Component, OnDestroy, OnInit} from '@angular/core';
import {RoomService} from "../../core/services/room.service";
import {takeUntil} from "rxjs/operators";
import {ResourceManagement} from "../../core/utils/resourceManagement";

@Component({
  selector: 'app-users-in-room',
  templateUrl: './users-in-room.component.html',
  styleUrls: ['./users-in-room.component.css']
})
export class UsersInRoomComponent extends ResourceManagement implements OnInit, OnDestroy {
  currentRoomName: string = "";

  constructor(private roomService: RoomService) {
    super();
  }

  ngOnInit(): void {
    console.log("UsersInRoomComponent gestartet")
    this.getCurrentRoomName();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  getCurrentRoomName(): void {
    this.roomService
      .getCurrentRoomName()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(currentRoomName => {
        this.currentRoomName = currentRoomName;
      })
  }

}
