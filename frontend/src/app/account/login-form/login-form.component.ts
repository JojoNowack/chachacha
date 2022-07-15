import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from "../../core/services/user.service";
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ResourceManagement } from 'src/app/core/utils/resourceManagement';
// import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})

export class LoginFormComponent extends ResourceManagement implements OnInit, OnDestroy {

  // email = new FormControl('', [Validators.required, Validators.email]);
  model = { email: "phe@test.de", password: "1234" };
  loggedIn: boolean = false;
  homePath = "/home";

  constructor(private userService: UserService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.isLoggedIn();
    //todo rausnehmen
    //setTimeout( () => {  this.userService.login("u1@test.de","1234") }, 1000 );

  }

  ngOnDestroy(): void {
    this.destroy();
  }

  isLoggedIn(): void {
    this.userService
      .isLoggedIn()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(loggedIn => {
        this.loggedIn = loggedIn;

        if (this.loggedIn) {
          this.router.navigate([this.homePath]);
        }
      });
  }

  resetRegistered(): void {
    this.userService.resetRegistered();
  }

  onSubmit(event: any) {
    this.userService.login(this.model.email, this.model.password);
  }

  // getErrorMessage() {
  //   if (this.email.hasError('required')) {
  //     return 'You must enter a value';
  //   }
  //   return this.email.hasError('email') ? 'Not a valid email' : '';
  // }
}
