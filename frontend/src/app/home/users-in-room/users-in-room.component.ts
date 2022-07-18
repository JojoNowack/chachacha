import {Component, OnDestroy, OnInit} from '@angular/core';
import {RoomService} from "../../core/services/room.service";
import {takeUntil} from "rxjs/operators";
import {ResourceManagement} from "../../core/utils/resourceManagement";
import {UserService} from 'src/app/core/services/user.service';

@Component({
  selector: 'app-users-in-room',
  templateUrl: './users-in-room.component.html',
  styleUrls: ['./users-in-room.component.css']
})
export class UsersInRoomComponent extends ResourceManagement implements OnInit, OnDestroy {

  currentRoomName: string = "";
  currentUser: { email: string, name: string } = {email: "", name: ""};
  currentUsers: { email: string, name: string }[] = [];
  selectedUser?: { email: string, name: string };
  currentOps: { email: string, op: boolean }[] = [];
  currentVoices: { email: string, voice: boolean }[] = [];
  currentVoice: boolean = false;
  currentOp: boolean = false;

  constructor(private userService: UserService, private roomService: RoomService) {
    super();
  }

  ngOnInit(): void {
    this.getCurrentRoomName();
    this.getCurrentUser();
    this.getCurrentUsers();
    this.getCurrentOps();
    this.getCurrentVoices();
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

  getCurrentUser(): void {
    this.userService.getUser()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(user => {
        this.currentUser = {email: user.email, name: user.userName};
      })
  }

  getCurrentUsers(): void {
    this.roomService
      .getCurrentUsers()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(currentUsers => {
        this.currentUsers = currentUsers;
      })
  }

  getCurrentOps(): void {
    this.roomService
      .getCurrentOps()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(currentOps => {
        this.currentOps = currentOps;
        let currentOp = currentOps.filter(user => user.email === this.currentUser.email);
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
      .subscribe(currentVoices => {
        this.currentVoices = currentVoices;
        let currentVoice = currentVoices.filter(user => user.email === this.currentUser.email);
        if (currentVoice.length !== 0) {
          this.currentVoice = currentVoice[0].voice;
        } else {
          this.currentVoice = false;
        }
      })
  }

  checkOp(email: string): boolean {
    let currentOp = this.currentOps.filter(user => user.email === email);
    if (currentOp.length !== 0) {
      return currentOp[0].op;
    }
    return false;
  }

  checkVoice(email: string): boolean {
    let currentVoice = this.currentVoices.filter(user => user.email === email);
    if (currentVoice.length !== 0) {
      return currentVoice[0].voice;
    }
    return false;
  }

  grantOpClicked(email: string, op: boolean): void {
    this.roomService.grantOp(this.currentRoomName, email, op);
  }

  grantVoiceClicked(email: string, voice: boolean): void {
    this.roomService.grantVoice(this.currentRoomName, email, voice);
  }

  onSelect(user: { email: string, name: string }): void {
    this.selectedUser = user;
  }
}
