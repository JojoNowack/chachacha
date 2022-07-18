import { Component } from '@angular/core';
import { RoomService } from '../core/services/room.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [RoomService],
})
export class HomeComponent {

  constructor() { }
}
