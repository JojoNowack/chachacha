import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RoomsComponent } from './rooms/rooms.component';
import { UserComponent } from './user/user.component';
import { MessagesComponent } from './messages/messages.component';
import { MaterialExampleModule } from 'src/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsersInRoomComponent } from "./users-in-room/users-in-room.component";
import { DialogInviteToRoomComponent } from './dialoges/dialog-invite-to-room/dialog-invite-to-room.component';
import { DialogChangePasswordComponent } from './dialoges/dialog-change-password/dialog-change-password.component';
import { DialogRenameComponent } from './dialoges/dialog-rename/dialog-rename.component';
import { RoomService } from '../core/services/room.service';
import { DialogUninviteToRoomComponent } from './dialoges/dialog-uninvite-to-room/dialog-uninvite-to-room.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialExampleModule
  ],
  declarations: [HomeComponent, RoomsComponent, UserComponent, MessagesComponent, UsersInRoomComponent,
    DialogInviteToRoomComponent, DialogUninviteToRoomComponent, DialogChangePasswordComponent, DialogRenameComponent],
  exports: [HomeComponent, RoomsComponent, UserComponent, MessagesComponent, UsersInRoomComponent,
    DialogInviteToRoomComponent, DialogUninviteToRoomComponent, DialogChangePasswordComponent, DialogRenameComponent],
  entryComponents: [DialogRenameComponent, DialogChangePasswordComponent, DialogInviteToRoomComponent, DialogUninviteToRoomComponent],
  providers: [RoomService],
  bootstrap: [HomeComponent],
})

export class HomeModule { }
