import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})


export class LoginFormComponent implements OnInit {

  model = { email: "phe@test.de", password: "1234" };
  loggedIn: boolean = false;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.isLoggedIn();
  }

  isLoggedIn(): void {
    this.userService.isLoggedIn().subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    });
  }

  onSubmit(event: any) {
    console.log(event.submitter.name);
    switch (event.submitter.name) {
      case "Login":
        this.userService.login(this.model.email, this.model.password);
        break;
      case "Logout":
        this.userService.logout();
        break;
    }
  }
}
