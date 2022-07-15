import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from 'src/app/core/services/user.service';
import {ResourceManagement} from 'src/app/core/utils/resourceManagement';
import {takeUntil} from 'rxjs/operators';
import {User} from "../../core/models/chat-types";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent extends ResourceManagement implements OnInit, OnDestroy {
  currentUser: User = new User;
  newUserName: string ="";
  constructor(private userService: UserService, public dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    console.log("UserComponent onInit");
    this.getUser();
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

  logoutButtonClicked() {
    //todo @simon sollten wir da noch mehr machen?
    this.userService.logout();
  }

  changeUserNameButtonClicked() {
    //this.userService.renameUser("test","test");
   //todo dialog
  }



}
