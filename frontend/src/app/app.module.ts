import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {RoomsComponent} from './rooms/rooms.component';
import {ConnectionComponent} from './connection/connection.component';
import {MessagesComponent} from './messages/messages.component';
import {FormsModule} from "@angular/forms";
import {LoginFormComponent} from './login-form/login-form.component';
import {MessageFormComponent} from './message-form/message-form.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialExampleModule} from '../material.module';

@NgModule({
  declarations: [
    AppComponent,
    RoomsComponent,
    ConnectionComponent,
    MessagesComponent,
    LoginFormComponent,
    MessageFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,

    MaterialExampleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
