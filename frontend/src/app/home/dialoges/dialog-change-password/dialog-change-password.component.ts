import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from "../../../core/services/user.service";
import { ResourceManagement } from "../../../core/utils/resourceManagement";
import { User } from "../../../core/models/chat-types";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-dialog-change-password',
  templateUrl: './dialog-change-password.component.html',
  styleUrls: ['./dialog-change-password.component.css']
})
export class DialogChangePasswordComponent extends ResourceManagement implements OnInit, OnDestroy {
  currentUser: User = new User;
  oldPassword: string = "";
  newPassword: string = "";

  constructor(private userService: UserService) {
    super();
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.userService
      .getUser()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(user => {
        this.currentUser = user;
      })
  }

  ngOnDestroy(): void {
    this.destroy();
  }


  changePasswordButtonClicked() {
    if (this.newPassword !== "" && this.oldPassword !== "") {
      this.userService.changeUserPassword(this.currentUser.email, this.oldPassword, this.newPassword);
    }
  }
}
