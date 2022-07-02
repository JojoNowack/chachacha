import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import {
  ChangeUserPasswordEvent,
  ChangePasswordFailedEvent,
  LoggedInEvent,
  LoggedOutEvent,
  LogginFailedEvent,
  UserRegisteredEvent,
  UserRenameEvent,
  User
} from './types';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly changeUserPasswordMessages = new ReplaySubject<ChangeUserPasswordEvent>();
  private readonly changePasswordFailedMessages = new ReplaySubject<ChangePasswordFailedEvent>();
  private readonly loggedInMessages = new ReplaySubject<LoggedInEvent>();
  private readonly loggedOutMessages = new ReplaySubject<LoggedOutEvent>();
  private readonly logginFailedMessages = new ReplaySubject<LogginFailedEvent>();
  private readonly userRegisteredMessages = new ReplaySubject<UserRegisteredEvent>();
  private readonly userRenameMessages = new ReplaySubject<UserRenameEvent>();

  private readonly loggedIn = new BehaviorSubject<boolean>(false);
  private readonly user = new BehaviorSubject<User>(new User());
  private readonly id = new BehaviorSubject<number>(-1);
  private readonly userRegistered = new BehaviorSubject<User>(new User());
  private readonly registered = new BehaviorSubject<boolean>(false);

  constructor(private webSocketService: WebsocketService) {
    let id = this.webSocketService.getId();
    id.subscribe((id) => {
      this.id.next(id);
    })
    this.handleEvents();
  }

  private handleEvents() {
    const messages = this.webSocketService.getMessages();
    messages.subscribe((message) => {
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
      .subscribe(changeUserPassword => this.handleChangedUserPasswordMessages(changeUserPassword));
    this.changePasswordFailedMessages
      .subscribe(changePasswordFailed => this.handleChangePasswordFailedMessages(changePasswordFailed));
    this.loggedInMessages
      .subscribe(loggedIn => this.handleLoggedInMessages(loggedIn));
    this.loggedOutMessages
      .subscribe(loggedOut => this.handleLoggedOutMessages(loggedOut));
    this.logginFailedMessages
      .subscribe(logginFailed => this.handleLogginFailedMessages(logginFailed));
    this.userRegisteredMessages
      .subscribe(userRegistered => this.handleUserRegisteredMessages(userRegistered));
    this.userRenameMessages
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
      let user = new User(userRegistered.id, userRegistered.email, userRegistered.name);
      this.userRegistered.next(user);
      this.registered.next(true);
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

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getUser(): Observable<User> {
    return this.user.asObservable();
  }
}
