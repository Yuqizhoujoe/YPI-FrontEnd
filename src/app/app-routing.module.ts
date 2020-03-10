import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { FormulaComponent } from './components/formula/formula.component';
import { TempleteAppComponent } from './components/templete-app/templete-app.component';
import { AppComponent as ResourcePage} from './components/resourcePage/app/app.component';
import { AppComponent as ProjectPage} from './components/projectPage/app/app.component';
import { LoginPageComponent} from './components/homepage/login-page/login-page.component';
import { AuthGuard } from './guards';
import { AppComponent as Home} from './components/homepage/app/app.component';
import { ComingSoonPageComponent } from './components/coming-soon-page/coming-soon-page.component';

import { CommonModule } from '@angular/common';

const routes:Routes = [
  // {path: "", component: Home}, // CONTAINS  THE HEADER/NAVBAR/FOOTER
  {path: "homePage", component: LoginPageComponent}, // CONTAINS THE LOGIN PAGE (HOME PAGE)(APP)
  {path: "resourcesPage", component: ResourcePage, canActivate: [AuthGuard] }, // CONTAINS THE RESOURCES PAGE(APP)
  {path: "projectPage", component: ProjectPage,  canActivate: [AuthGuard] }, // CONTAINS THE PROJECT PAGE(APP)
  {path: "formulaPage", component: FormulaComponent, canActivate: [AuthGuard] }, // CONTAINS THE FORMALA PAGE(APP)
  {path: "formulaPage/templete", component: TempleteAppComponent}, // CONTAINS THE TEMPLETE(SUB_RESOURCES) PAGE(APP
  {path: "changeRequest", component: ComingSoonPageComponent},
  {path: "budget", component: ComingSoonPageComponent},
  {path: "primeSupplier", component: ComingSoonPageComponent},
  {path: "changeControl", component: ComingSoonPageComponent},
  {path: "contract", component: ComingSoonPageComponent},
  {path: "approvedChange", component: ComingSoonPageComponent},
  {path: "summary", component: ComingSoonPageComponent},
  {path: 'resourcesPage', component: ResourcePage, canActivate: [AuthGuard] },
  {path: '', redirectTo: '/homePage', pathMatch: 'full' }

];


@NgModule({
  exports:[RouterModule],
  imports: [
    RouterModule.forRoot(routes) // ADDS THE ROUTES TO ROOT COMPONENT
  ]
})
export class AppRoutingModule { }
