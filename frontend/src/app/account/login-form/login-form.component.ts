import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from "../../core/services/user.service";
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ResourceManagement } from 'src/app/core/utils/resourceManagement';
import { Title } from "@angular/platform-browser";

// import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})

export class LoginFormComponent extends ResourceManagement implements OnInit, OnDestroy {

  // email = new FormControl('', [Validators.required, Validators.email]);
  // model = { email: "phe@test.de", password: "1234" };
  model = { email: "", password: "" };
  loggedIn: boolean = false;
  homePath = "/home";

  title = 'Login to ChaChaChat';

  constructor(private userService: UserService, private router: Router, private titleService: Title) {
    super();
  }

  ngOnInit(): void {
    this.isLoggedIn();
    this.titleService.setTitle(this.title);
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
}
