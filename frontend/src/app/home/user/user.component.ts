import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { ResourceManagement } from 'src/app/core/utils/resourceManagement';
import { takeUntil } from 'rxjs/operators';
import { User } from "../../core/models/chat-types";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { RoomService } from 'src/app/core/services/room.service';
import { DialogRenameComponent } from "../dialoges/dialog-rename/dialog-rename.component";
import { ComponentType } from "@angular/cdk/overlay";
import { DialogChangePasswordComponent } from "../dialoges/dialog-change-password/dialog-change-password.component";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent extends ResourceManagement implements OnInit, OnDestroy {
  currentUser: User = new User;
  currentRoomName: string = "";
  currentVoice: boolean = false;
  currentOp: boolean = false;


  constructor(private userService: UserService, private roomService: RoomService, public myDialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.getUser();
    this.getCurrentRoomName();
    this.getCurrentOps();
    this.getCurrentVoices();
  }

  ngOnDestroy(): void {
    this.destroy();
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

  getCurrentOps(): void {
    this.roomService
      .getCurrentOps()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(opArray => {
        let currentOp = opArray.filter(user => user.email === this.currentUser.email);
        if (currentOp.length !== 0) {
          this.currentOp = currentOp[0].op;
        } else {
          this.currentOp = false;
        }
      })
  }

  getCurrentVoices(): void {
    this.roomService
      .getCurrentVoices()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(voiceArray => {
        let currentVoice = voiceArray.filter(user => user.email === this.currentUser.email);
        if (currentVoice.length !== 0) {
          this.currentVoice = currentVoice[0].voice;
        } else {
          this.currentVoice = false;
        }
      })
  }

  logoutButtonClicked() {
    this.userService.logout();
  }

  changeUserNameButtonClicked() {
    this.openDialog(DialogRenameComponent);
  }

  openDialog(myCustomDialog: ComponentType<any>) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    this.myDialog.open(myCustomDialog, dialogConfig);
  }

  changePasswordButtonClicked() {
    this.openDialog(DialogChangePasswordComponent);
  }

  deleteUserButtonClicked(): void {
    this.userService.deleteUser(this.currentUser.email);
  }
}
