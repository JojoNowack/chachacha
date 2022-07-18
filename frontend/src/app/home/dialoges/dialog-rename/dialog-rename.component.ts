import {Component, OnDestroy, OnInit} from '@angular/core';
import {ResourceManagement} from "../../../core/utils/resourceManagement";
import {UserComponent} from "../../user/user.component";
import {UserService} from "../../../core/services/user.service";
import {MatDialogRef} from "@angular/material/dialog";
import {takeUntil} from "rxjs/operators";
import {User} from "../../../core/models/chat-types";

@Component({
  selector: 'app-dialog-rename',
  templateUrl: './dialog-rename.component.html',
  styleUrls: ['./dialog-rename.component.css']
})
export class DialogRenameComponent extends ResourceManagement implements OnInit, OnDestroy {
  newUsername: string = "";
  currentUser: User = new User;

  constructor(private userService: UserService) {
    super();
  }

  ngOnInit(): void {
    this.getUser();
    console.log("DialogRenameComponent init");
  }

  ngOnDestroy(): void {
    console.log("Dialog destroy");
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

  renameButtonClicked() {
    this.userService.renameUser(this.currentUser.email, this.newUsername)
  }
}
