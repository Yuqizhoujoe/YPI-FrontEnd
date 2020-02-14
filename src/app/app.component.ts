import { Component } from '@angular/core';
import {HeaderComponent} from './components/homepage/header/header.component';
import {NavbarComponent} from './components/homepage/navbar/navbar.component';
import {FooterComponent} from './components/homepage/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'YPI';
}
