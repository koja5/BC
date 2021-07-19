import { DemoComponent } from './component/demo/demo.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NotFoundComponent } from "./component/templates/not-found/not-found.component";
import { LoggedGuardService } from "./services/guard/logged-guard.service";
import { LoginGuardService } from './services/guard/login-guard.service';
import { DashboardGuardService } from './services/guard/dashboard-guard.service';
import { PrivacyPolicyComponent } from './component/templates/privacy-policy/privacy-policy.component';
import { TermsComponent } from './component/templates/terms/terms.component';
import { MaintenceComponent } from './component/templates/maintence/maintence.component';
import { ImpressumComponent } from './component/templates/impressum/impressum.component';
import { RecommendedAnswerComponent } from './component/templates/recommended-answer/recommended-answer.component';
import { SuccessComponent } from './component/templates/success/success.component';

const routes: Routes = [
  {
    path: "login/:languageCode",
    canActivate: [LoggedGuardService],
    loadChildren: "./component/login/login.module#LoginModule"
  },
  {
    path: "login",
    canActivate: [LoggedGuardService],
    redirectTo: 'login/en',
  },
  {
    path: "dashboard",
    canActivate: [LoginGuardService, DashboardGuardService],
    loadChildren: () => import('./component/superadmin/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: "home",
    canActivate: [LoginGuardService, DashboardGuardService],
    loadChildren: () => import('./component/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms',
    component: TermsComponent
  },
  {
    path: 'impressum',
    component: ImpressumComponent
  },
  {
    path: 'maintence',
    component: MaintenceComponent
  },
  {
    path: 'recommended-answer',
    component: RecommendedAnswerComponent
  },
  {
    path: 'success',
    component: SuccessComponent
  },
  {
    path: 'demo',
    component: DemoComponent
  },
  {
    path: "**",
    pathMatch: "full",
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
