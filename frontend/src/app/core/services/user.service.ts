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
  UserRenamedEvent,
  UserDeletedEvent,
} from '../models/backend-event-types';
import { User } from '../models/chat-types';
import { ResourceManagement } from '../utils/resourceManagement';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ResourceManagement implements OnDestroy {

  private readonly changeUserPasswordMessages = new ReplaySubject<ChangeUserPasswordEvent>(1, 1000);
  private readonly changePasswordFailedMessages = new ReplaySubject<ChangePasswordFailedEvent>(1, 1000);
  private readonly loggedInMessages = new ReplaySubject<LoggedInEvent>(1, 1000);
  private readonly loggedOutMessages = new ReplaySubject<LoggedOutEvent>(1, 1000);
  private readonly logginFailedMessages = new ReplaySubject<LogginFailedEvent>(1, 1000);
  private readonly userRegisteredMessages = new ReplaySubject<UserRegisteredEvent>(1, 1000);
  private readonly userRenamedMessages = new ReplaySubject<UserRenamedEvent>(1, 1000);
  private readonly userDeletedMessages = new ReplaySubject<UserDeletedEvent>(1, 1000);

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
        if (id !== undefined) {
          this.id.next(id);
        }
      })
    this.handleEvents();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  reset(): void {
    this.changeUserPasswordMessages.next(undefined as any);
    this.changePasswordFailedMessages.next(undefined as any);
    this.loggedInMessages.next(undefined as any);
    this.loggedOutMessages.next(undefined as any);
    this.logginFailedMessages.next(undefined as any);
    this.userRegisteredMessages.next(undefined as any);
    this.userRenamedMessages.next(undefined as any);
    this.userDeletedMessages.next(undefined as any);
  }

  private handleEvents() {
    const messages = this.webSocketService.getMessages();
    messages
      .pipe(takeUntil(this.preDestroy))
      .subscribe((message) => {
        if (message !== undefined) {
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
            case 'UserRenamed':
              let userRenamedEvent: UserRenamedEvent = value;
              this.userRenamedMessages.next(userRenamedEvent);
              break;
            case 'UserDeleted':
              let userDeletedEvent: UserDeletedEvent = value;
              this.userDeletedMessages.next(userDeletedEvent);
              break;
          }
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
    this.userRenamedMessages
      .pipe(takeUntil(this.preDestroy))
      .subscribe(userRenamed => this.handleUserRenamedMessages(userRenamed));
    this.userDeletedMessages
      .pipe(takeUntil(this.preDestroy))
      .subscribe(userDeleted => this.handleUserDeletedMessages(userDeleted));
  }

  handleChangedUserPasswordMessages(changeUserPassword: ChangeUserPasswordEvent): void {
    if (changeUserPassword !== undefined) {
      if (this.id.getValue() !== changeUserPassword.id) {
        this.logout();
        this.user.next(new User);
        this.loggedIn.next(true);
      }
    }
  }

  handleChangePasswordFailedMessages(changePasswordFailed: ChangePasswordFailedEvent): void {
    if (changePasswordFailed !== undefined) {
    }
  }

  handleLoggedInMessages(loggedIn: LoggedInEvent): void {
    if (loggedIn !== undefined) {
      if (this.id.getValue() === loggedIn.id) {
        let user = new User(loggedIn.id, loggedIn.email, loggedIn.name, loggedIn.token);
        this.user.next(user);
        this.loggedIn.next(true);
      }
    }
  }

  handleLoggedOutMessages(loggedOut: LoggedOutEvent): void {
    if (loggedOut !== undefined) {
      if (this.id.getValue() === loggedOut.id) {
        this.user.next(new User);
        this.loggedIn.next(false);
        this.registered.next(false);
        this.reset();
        this.router.navigate([this.loginPath]);
      }
    }
  }

  handleLogginFailedMessages(logginFailed: LogginFailedEvent): void {
    if (logginFailed !== undefined) {
    }
  }

  handleUserRenamedMessages(userRenamed: UserRenamedEvent): void {
    if (userRenamed !== undefined) {
      let user = this.user.getValue();
      if (user.email === userRenamed.email) {
        if (user.userName !== userRenamed.name) {
          let changedUser = new User(user.id, user.email, userRenamed.name, user.token);
          this.user.next(changedUser);
        }
      }
    }
  }

  handleUserRegisteredMessages(userRegistered: UserRegisteredEvent): void {
    if (userRegistered !== undefined) {
      if (this.id.getValue() === userRegistered.id) {
        this.registered.next(true);
        // let user = new User(userRegistered.id, userRegistered.email, userRegistered.name);
        // this.userRegistered.next(user);
      }
    }
  }

  handleUserDeletedMessages(userDeleted: UserDeletedEvent): void {
    if (userDeleted !== undefined) {
      if (this.user.getValue().email === userDeleted.email) {
        // clean everything
      }
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
    let data = { "email": email, "oldPassword": oldPassword, "newPassword": newPassword };
    this.webSocketService.sendCommand('ChangeUserPassword', data);
  }

  renameUser(email: string, userName: string): void {
    let data = { "email": email, "userName": userName };
    this.webSocketService.sendCommand('RenameUser', data);
  }

  deleteUser(email: string): void {
    let data = { "email": email };
    this.webSocketService.sendCommand('DeleteUser', data);
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
