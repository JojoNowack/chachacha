import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import {
  ChangeUserPasswordEvent,
  ChangePasswordFailedEvent,
  LoggedInEvent,
  LoggedOutEvent,
  LogginFailedEvent,
  UserRegisteredEvent,
  UserRenameEvent,
} from '../models/backend-event-types';
import { User } from '../models/chat-types';
import { ResourceManagement } from '../utils/resourceManagement';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ResourceManagement implements OnDestroy {

  private readonly changeUserPasswordMessages = new ReplaySubject<ChangeUserPasswordEvent>(1);
  private readonly changePasswordFailedMessages = new ReplaySubject<ChangePasswordFailedEvent>(1);
  private readonly loggedInMessages = new ReplaySubject<LoggedInEvent>(1);
  private readonly loggedOutMessages = new ReplaySubject<LoggedOutEvent>(1);
  private readonly logginFailedMessages = new ReplaySubject<LogginFailedEvent>(1);
  private readonly userRegisteredMessages = new ReplaySubject<UserRegisteredEvent>(1);
  private readonly userRenameMessages = new ReplaySubject<UserRenameEvent>(1);

  private readonly loggedIn = new BehaviorSubject<boolean>(false);
  private readonly user = new BehaviorSubject<User>(new User());
  private readonly id = new BehaviorSubject<number>(-1);
  private readonly registered = new BehaviorSubject<boolean>(false);
  // private readonly userRegistered = new BehaviorSubject<User>(new User());

  readonly loginPath = "/login";

  constructor(private webSocketService: WebsocketService, private router: Router) {
    super();
    let id = this.webSocketService.getId();
    id
      .pipe(takeUntil(this.preDestroy))
      .subscribe((id) => {
        this.id.next(id);
      })
    this.handleEvents();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  private handleEvents() {
    const messages = this.webSocketService.getMessages();
    messages
      .pipe(takeUntil(this.preDestroy))
      .subscribe((message) => {
        let data = JSON.parse(message.data);
        let type: string = data.type;
        let value = data.value;
        switch (type) {
          case 'ChangeUserPassword':
            let changeUserPasswordEvent: ChangeUserPasswordEvent = value;
            this.changeUserPasswordMessages.next(changeUserPasswordEvent);
            break;
          case 'ChangePasswordFailed':
            let changePasswordFailedEvent: ChangePasswordFailedEvent = value;
            this.changePasswordFailedMessages.next(changePasswordFailedEvent);
            break;
          case 'LoggedIn':
            let loggedInEvent: LoggedInEvent = value;
            this.loggedInMessages.next(loggedInEvent);
            break;
          case 'LoggedOut':
            let loggedOutEvent: LoggedOutEvent = value;
            this.loggedOutMessages.next(loggedOutEvent);
            break;
          case 'LogginFailed':
            let logginFailedEvent: LogginFailedEvent = value;
            this.logginFailedMessages.next(logginFailedEvent);
            break;
          case 'UserRegistered':
            let userRegisteredEvent: UserRegisteredEvent = value;
            this.userRegisteredMessages.next(userRegisteredEvent);
            break;
          case 'UserRename':
            let userRenameEvent: UserRenameEvent = value;
            this.userRenameMessages.next(userRenameEvent);
            break;
        }
      });

    this.changeUserPasswordMessages
      .pipe(takeUntil(this.preDestroy))
      .subscribe(changeUserPassword => this.handleChangedUserPasswordMessages(changeUserPassword));
    this.changePasswordFailedMessages
      .pipe(takeUntil(this.preDestroy))
      .subscribe(changePasswordFailed => this.handleChangePasswordFailedMessages(changePasswordFailed));
    this.loggedInMessages
      .pipe(takeUntil(this.preDestroy))
      .subscribe(loggedIn => this.handleLoggedInMessages(loggedIn));
    this.loggedOutMessages
      .pipe(takeUntil(this.preDestroy))
      .subscribe(loggedOut => this.handleLoggedOutMessages(loggedOut));
    this.logginFailedMessages
      .pipe(takeUntil(this.preDestroy))
      .subscribe(logginFailed => this.handleLogginFailedMessages(logginFailed));
    this.userRegisteredMessages
      .pipe(takeUntil(this.preDestroy))
      .subscribe(userRegistered => this.handleUserRegisteredMessages(userRegistered));
    this.userRenameMessages
      .pipe(takeUntil(this.preDestroy))
      .subscribe(userRename => this.handleUserRenameMessages(userRename));
  }

  handleChangedUserPasswordMessages(changeUserPassword: ChangeUserPasswordEvent): void {
    if (this.id.getValue() !== changeUserPassword.id) {
      this.logout();
      this.user.next(new User);
      this.loggedIn.next(true);
    }
  }

  handleChangePasswordFailedMessages(changePasswordFailed: ChangePasswordFailedEvent): void {
  }

  handleLoggedInMessages(loggedIn: LoggedInEvent): void {
    if (this.id.getValue() === loggedIn.id) {
      let user = new User(loggedIn.id, loggedIn.email, loggedIn.name, loggedIn.token);
      this.user.next(user);
      this.loggedIn.next(true);
    }
  }

  handleLoggedOutMessages(loggedOut: LoggedOutEvent): void {
    if (this.id.getValue() === loggedOut.id) {
      this.user.next(new User);
      this.loggedIn.next(false);
      this.registered.next(false);
      this.router.navigate([this.loginPath]);
    }
  }

  handleLogginFailedMessages(logginFailed: LogginFailedEvent): void {
  }

  handleUserRenameMessages(userRename: UserRenameEvent): void {
    let user = this.user.getValue();
    if (user.email === userRename.email) {
      if (user.userName !== userRename.userName) {
        let changedUser = new User(user.id, user.email, userRename.userName, user.token);
        this.user.next(changedUser);
      }
    }
  }

  handleUserRegisteredMessages(userRegistered: UserRegisteredEvent): void {
    if (this.id.getValue() === userRegistered.id) {
      this.registered.next(true);
      // let user = new User(userRegistered.id, userRegistered.email, userRegistered.name);
      // this.userRegistered.next(user);

    }
  }

  login(email: string, password: string): void {
    let data = { "email": email, "password": password };
    this.webSocketService.sendCommand('Login', data);
  }

  logout(): void {
    let data = {};
    this.webSocketService.sendCommand('Logout', data);
  }

  registerUser(email: string, name: string, password: string): void {
    let data = { "email": email, "name": name, "password": password };
    this.webSocketService.sendCommand('RegisterUser', data);
  }

  changeUserPassword(email: string, oldPassword: string, newPassword: string): void {
    let data = { "email": email, "oldPassword": oldPassword, "newPassword": newPassword }
    this.webSocketService.sendCommand('ChangeUserPassword', data);
  }

  renameUser(email: string, userName: string): void {
    let data = { "email": email, "userName": userName }
    this.webSocketService.sendCommand('RenameUser', data);
  }

  getUser(): Observable<User> {
    return this.user.asObservable();
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  isRegistered(): Observable<boolean> {
    return this.registered.asObservable();
  }

  resetRegistered(): void {
    this.registered.next(false);
  }
}
