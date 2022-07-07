import { Injectable } from '@angular/core';
import { DebugService } from "./debug.service";
import { BehaviorSubject, Observable, ReplaySubject } from "rxjs";
import { filter } from "rxjs/operators";
import { COMMANDS } from './mock-commands';
import { SocketIdEvent, LoggedInEvent, LogginFailedEvent, LoggedOutEvent } from './types';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private connection?: WebSocket;
  private readonly messages = new ReplaySubject<MessageEvent>();
  private readonly socketIdMessages = new ReplaySubject<SocketIdEvent>();
  readonly id = new BehaviorSubject<number>(-1);

  constructor(public debugService: DebugService) {
    this.initializeWebsocket();
  }

  private initializeWebsocket() {
    this.connection = new WebSocket('ws://20.216.24.28:8080/chatSocket/');
    //this.connection = new WebSocket('ws://localhost:8080/chatSocket/');
    this.connection.onopen = this.onOpen.bind(this);
    this.connection.onmessage = this.onMessage.bind(this);
    this.connection.onerror = this.onError.bind(this);
    this.connection.onclose = this.onClose.bind(this);
  }

  onOpen(message: any): void {
    this.debugService.add(`websocketService: onOpen called: Connection Open`);
    // setTimeout(this.onTest.bind(this), 1000);
  }

  onMessage(message: MessageEvent): void {
    let data = JSON.parse(message.data);
    let type: string = data.type;
    let value = data.value;
    console.warn("Type: " + type + " Value: ");
    console.log(data);

    this.messages.next(message);

    switch (type) {
      case 'SocketIdEvent':
        let socketIdEvent: SocketIdEvent = value;
        this.socketIdMessages.next(socketIdEvent);
        this.id.next(socketIdEvent.id);
        break;
    }
  }

  onError(message: any): void {
    this.debugService.add(`websocketService: onError called: ` + message.toString());
    console.log("onError", message);
  }

  onClose(message: any): void {
    this.debugService.add(`websocketService: onClose called: ` + message.toString());
    console.log("onClose", message);

    // reconnect?
  }

  sendCommand(type: string, data: any): this {
    const command = {
      type: type,
      value: data
    };
    // @ts-ignore
    this.connection.send(JSON.stringify(command));
    return this;
  }

  getMessages(type?: string): Observable<any> {
    switch (type) {
      case 'SocketIdEvent':
        return this.socketIdMessages.asObservable() as Observable<SocketIdEvent>;
      default:
        return this.messages.asObservable();
    }
  }

  getId(): Observable<number> {
    return this.id.asObservable();
  }

  onTest() {
    setTimeout(() => {
      let type = 'Login';
      // @ts-ignore
      let data = COMMANDS.find(e => e.type === type).template;
      this.sendCommand(type, data);
    }, 1500);

    setTimeout(() => {
      let type = 'Logout';
      // @ts-ignore
      let data = COMMANDS.find(e => e.type === type).template;
      this.sendCommand(type, data);
    }, 2000);

    setTimeout(() => {
      let type = 'Login';
      let data = {
        password: "wrong",
        email: "test@wrong.com"
      }
      this.sendCommand(type, data);
    }, 2500);
  }
}
