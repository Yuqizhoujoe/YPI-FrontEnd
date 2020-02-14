import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { AppComponent } from './app.component';
import { AppRoutingModule} from ".//app-routing.module";
import { AppComponent as Home} from "./components/homepage/app/app.component";
import { HeaderComponent } from './components/homepage/header/header.component';
import { NavbarComponent } from './components/homepage/navbar/navbar.component';
import { LoginPageComponent } from './components/homepage/login-page/login-page.component';
import { AppComponent as ResourcePage } from './components/resourcePage/app/app.component';
import { AppComponent as ProjectPage } from './components/projectPage/app/app.component';
import { AppComponent as FormulaPage } from './components/formulaPage/app/app.component';
import { AppComponent as TempletePage } from './components/formulaPage/app/app.component';

@NgModule({
  declarations: [
    AppComponent,
    Home,
    HeaderComponent,
    NavbarComponent,
    LoginPageComponent,
    ResourcePage,
    ProjectPage,
    FormulaPage,
    TempletePage
  ],
  imports: [BrowserModule, FormsModule,  AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
