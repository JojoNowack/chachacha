import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUninviteToRoomComponent } from './dialog-uninvite-to-room.component';

describe('DialogInviteToRoomComponent', () => {
  let component: DialogUninviteToRoomComponent;
  let fixture: ComponentFixture<DialogUninviteToRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogUninviteToRoomComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUninviteToRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //it('should create', () => {
  //  expect(component).toBeTruthy();
  //});
});
