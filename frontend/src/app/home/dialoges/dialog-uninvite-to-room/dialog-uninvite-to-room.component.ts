import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResourceManagement } from "../../../core/utils/resourceManagement";
import { takeUntil } from "rxjs/operators";
import { RoomService } from "../../../core/services/room.service";

@Component({
  selector: 'app-dialog-uninvite-to-room',
  templateUrl: './dialog-uninvite-to-room.component.html',
  styleUrls: ['./dialog-uninvite-to-room.component.css']
})
export class DialogUninviteToRoomComponent extends ResourceManagement implements OnInit, OnDestroy {
  public inviteEmail: string = "";
  public currentRoomName: string = "";

  constructor(private roomService: RoomService) {
    super();
  }

  ngOnInit(): void {
    this.getCurrentRoomName();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  uninviteFriendButtonClicked() {
    if (this.inviteEmail !== "") {
      this.roomService.inviteToRoom(this.currentRoomName, this.inviteEmail, false);
    }
    this.inviteEmail = "";
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
