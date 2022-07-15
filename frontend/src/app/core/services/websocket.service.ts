import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from "rxjs";
import { SocketIdEvent } from '../models/backend-event-types';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {

  private connection?: WebSocket;
  private readonly messages = new ReplaySubject<MessageEvent>(1);
  private readonly socketIdMessages = new ReplaySubject<SocketIdEvent>(1);
  readonly id = new BehaviorSubject<number>(-1);

  constructor() {
    this.initializeWebsocket();
  }

  ngOnDestroy(): void {
    console.log("");
    // this.messages.next(Null)

    // this.preDestroy.next(true);
    // this.preDestroy.complete();
  }

  private initializeWebsocket() {
    //this.connection = new WebSocket('ws://20.216.24.28:8080/chatSocket/');
    this.connection = new WebSocket('ws://localhost:8080/chatSocket/');
    this.connection.onopen = this.onOpen.bind(this);
    this.connection.onmessage = this.onMessage.bind(this);
    this.connection.onerror = this.onError.bind(this);
    this.connection.onclose = this.onClose.bind(this);
  }

  onOpen(message: any): void {
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
    console.log("onError", message);
  }

  onClose(message: any): void {
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
}
