import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {HeaderComponent} from './components/homepage/header/header.component';

import {FooterComponent} from './components/homepage/footer/footer.component';

import { AuthenticationService } from './services/authentication.service';
import { User } from './models/user';
import { AlertComponent } from './components/homepage/alert/alert.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser: User;

  constructor(
      private router: Router,
      private authenticationService: AuthenticationService
  ) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
      this.authenticationService.logout();
      this.router.navigate(['/homePage']);
  }


}
