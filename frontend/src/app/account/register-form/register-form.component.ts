import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from "../../core/services/user.service";
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ResourceManagement } from 'src/app/core/utils/resourceManagement';
// import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})

export class RegisterFormComponent extends ResourceManagement implements OnInit, OnDestroy {

  // email = new FormControl('', [Validators.required, Validators.email]);
  model = { email: "newUser@test.de", username: "newUser", password: "1234" };
  registered: boolean = false;
  loginPath = "/login"

  constructor(private userService: UserService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.isRegistered();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  isRegistered(): void {
    this.userService
      .isRegistered()
      .pipe(takeUntil(this.preDestroy))
      .subscribe(registered => {
        this.registered = registered;

        if (this.registered) {
          this.router.navigate([this.loginPath]);
        }
      });
  }

  onSubmit(event: any) {
    this.userService.registerUser(this.model.email, this.model.username, this.model.password);
    //this.model={email: "", username: "", password: ""};
  }
}
