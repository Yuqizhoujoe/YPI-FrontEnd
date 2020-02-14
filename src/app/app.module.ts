import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
//import { HomeComponent } from './components/homepage/home/home.component';
import { HeaderComponent } from './components/homepage/header/header.component';
import { NavbarComponent } from './components/homepage/navbar/navbar.component';
import { LoginPageComponent } from './components/homepage/login-page/login-page.component';
import { ResourceAppComponent } from './components/resourcePage/resource-app/resource-app.component';
import { ProjectAppComponent } from './components/projectPage/project-app/project-app.component';
import { FormulaAppComponent } from './components/formulaPage/formula-app/formula-app.component';
import { TempleteAppComponent } from './components/formulaPage/templete-app/templete-app.component';

@NgModule({
  declarations: [
    AppComponent,
    // HomeComponent,
    HeaderComponent,
    NavbarComponent,
    LoginPageComponent,
    ResourceAppComponent,
    ProjectAppComponent,
    FormulaAppComponent,
    TempleteAppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
