import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from ".//app-routing.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from "@angular/core";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import {DecimalPipe} from '@angular/common';
import { AppComponent } from "./app.component";
import { AppComponent as Home } from "./components/homepage/app/app.component";
import { HeaderComponent } from "./components/homepage/header/header.component";
import { NavbarComponent } from "./components/homepage/navbar/navbar.component";
import { LoginPageComponent } from "./components/homepage/login-page/login-page.component";
import { AppComponent as ResourcePage } from "./components/resourcePage/app/app.component";
import { AppComponent as ProjectPage } from "./components/projectPage/app/app.component";
import { AppComponent as FormulaPage } from "./components/formulaPage/app/app.component";
import { AppComponent as TempletePage } from "./components/formulaPage/app/app.component";
import { FooterComponent } from "./components/homepage/footer/footer.component";
import { ResourceHeaderComponent } from './components/resourcePage/resource-header/resource-header.component';
import { ResourceTableComponent } from './components/resourcePage/resource-table/resource-table.component';
import { NgbdSortableHeader } from './directives/sortable.directive';


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
    TempletePage,
    FooterComponent,
    ResourceHeaderComponent,
    ResourceTableComponent,
    NgbdSortableHeader
    
  ],
  imports: [BrowserModule,BrowserAnimationsModule, AppRoutingModule, BrowserAnimationsModule,
    ReactiveFormsModule, FormsModule, NgbModule],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
