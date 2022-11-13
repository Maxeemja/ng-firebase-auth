import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  constructor(
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {
  }

}
