import { Component, OnInit } from '@angular/core';
import { WebsocketService } from "../websocket.service";
import { DebugService } from "../debug.service";

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit {

  constructor(private webSocketService: WebsocketService, public debugService: DebugService) { }

  ngOnInit(): void {
    //to satisfy linting ;)
    console.log("ConnectionComponent is started");
  }

}
