import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AppComponent as FormulaPage} from './components/formulaPage/app/app.component';
import { TempleteAppComponent as TempletePage} from './components/formulaPage/templete-app/templete-app.component';
import { AppComponent as ResourcePage} from './components/resourcePage/app/app.component';
import { AppComponent as ProjectPage} from './components/projectPage/app/app.component';
import { LoginPageComponent} from './components/homepage/login-page/login-page.component';
import { NavbarComponent} from './components/homepage/navbar/navbar.component';
import { AppComponent as Home} from './components/homepage/app/app.component';


import { CommonModule } from '@angular/common';

const routes:Routes = [

  {path: "", component: Home}, // CONTAINS  THE HEADER/NAVBAR/FOOTER
  {path: "homePage", component: LoginPageComponent}, // CONTAINS THE LOGIN PAGE (HOME PAGE)(APP)
  {path: "resourcesPage", component: ResourcePage}, // CONTAINS THE RESOURCES PAGE(APP)
  {path: "projectPage", component: ProjectPage}, // CONTAINS THE PROJECT PAGE(APP)
  {path: "formulaPage", component: FormulaPage}, // CONTAINS THE FORMALA PAGE(APP)
  {path: "formulaPage/templete", component: TempletePage} // CONTAINS THE TEMPLETE(SUB_RESOURCES) PAGE(APP)
];


@NgModule({
  exports:[RouterModule],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
