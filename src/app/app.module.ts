import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from ".//app-routing.module";
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarModule } from '@syncfusion/ej2-angular-navigations';
import { NgModule } from "@angular/core";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { DecimalPipe} from '@angular/common';
import { AppComponent } from "./app.component";
import { AppComponent as Home } from "./components/homepage/app/app.component";
import { HeaderComponent } from "./components/homepage/header/header.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { LoginPageComponent } from "./components/homepage/login-page/login-page.component";
import { AppComponent as ResourcePage } from "./components/resourcePage/app/app.component";
import { AppComponent as ProjectPage } from "./components/projectPage/app/app.component";
import { AppComponent as FormulaPage } from "./components/formulaPage/app/app.component";
import { AppComponent as TempletePage } from "./components/formulaPage/app/app.component";
import { FooterComponent } from "./components/homepage/footer/footer.component";
import { ResourceHeaderComponent } from './components/resourcePage/resource-header/resource-header.component';
import { ResourceTableComponent } from './components/resourcePage/resource-table/resource-table.component';
import { NgbdSortableHeader } from './directives/sortable.directive';
// used to create fake backend
import { fakeBackendProvider } from './helpers';
import { AlertComponent } from './components/homepage/alert/alert.component';
import { JwtInterceptor, ErrorInterceptor } from './helpers';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';



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
    NgbdSortableHeader,
    AlertComponent
    
  ],
  imports: [BrowserModule, CommonModule,BrowserAnimationsModule,HttpClientModule, AppRoutingModule, BrowserAnimationsModule,
    ReactiveFormsModule, FormsModule, NgbModule,SidebarModule, LayoutModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule],
  providers: [DecimalPipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        fakeBackendProvider

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
