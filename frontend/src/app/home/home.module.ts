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
  declarations: [HomeComponent, RoomsComponent, UserComponent, MessagesComponent, UsersInRoomComponent],
  exports: [HomeComponent, RoomsComponent, UserComponent, MessagesComponent, UsersInRoomComponent],
})

export class HomeModule { }
