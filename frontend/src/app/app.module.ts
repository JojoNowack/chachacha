import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginFormComponent} from './account/login-form/login-form.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialExampleModule} from '../material.module';
import {RegisterFormComponent} from './account/register-form/register-form.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {HomeModule} from './home/home.module';
import {MatDialogModule} from "@angular/material/dialog";
import {DialogRenameComponent} from './home/dialoges/dialog-rename/dialog-rename.component';
import { DialogChangePasswordComponent } from './home/dialoges/dialog-change-password/dialog-change-password.component';
import { DialogInviteToRoomComponent } from './home/dialoges/dialog-invite-to-room/dialog-invite-to-room.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    RegisterFormComponent,
    PageNotFoundComponent,
    DialogRenameComponent,
    DialogChangePasswordComponent,
    DialogInviteToRoomComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialExampleModule,
    HomeModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DialogRenameComponent,DialogInviteToRoomComponent]
})
export class AppModule {
}
