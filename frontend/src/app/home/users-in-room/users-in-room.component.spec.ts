import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersInRoomComponent } from './users-in-room.component';

describe('UsersInRoomComponent', () => {
  let component: UsersInRoomComponent;
  let fixture: ComponentFixture<UsersInRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersInRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersInRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //it('should create', () => {
  //  expect(component).toBeTruthy();
  //});
});
