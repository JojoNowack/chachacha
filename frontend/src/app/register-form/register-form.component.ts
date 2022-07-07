import {Component, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {User} from "../types";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
  model = {email: "newUser@test.de", username: "newUser", password: "1234"};

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    //to satisfy linting ;)
    console.log("RegisterFormComponent is started");
  }

  onSubmit(event: any) {
    //register was pressed

    this.userService.registerUser(this.model.email, this.model.username, this.model.password);
    //this.model={email: "", username: "", password: ""};
  }

  //todo route if user was registerd. else show error message

}
