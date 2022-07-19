import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInviteToRoomComponent } from './dialog-invite-to-room.component';

describe('DialogInviteToRoomComponent', () => {
  let component: DialogInviteToRoomComponent;
  let fixture: ComponentFixture<DialogInviteToRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogInviteToRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogInviteToRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //it('should create', () => {
  //  expect(component).toBeTruthy();
  //});
});
