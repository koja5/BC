import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NotFoundComponent } from "./component/templates/not-found/not-found.component";
import { LoggedGuard } from "./services/guard/logged-guard.service";
import { LoginGuard } from './services/guard/login-guard.service';
import { DashboardGuard } from './services/guard/dashboard-guard.service';

const routes: Routes = [
  {
    path: "login",
    canActivate: [LoggedGuard],
    loadChildren: "./component/login/login.module#LoginModule"
  },
  {
    path: "dashboard",
    canActivate: [LoginGuard, DashboardGuard],
    loadChildren: "./component/superadmin/dashboard.module#DashboardModule"
  },
  {
    path: "home",
    canActivate: [LoginGuard, DashboardGuard],
    loadChildren: "./component/home/home.module#HomeModule"
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
export class AppRoutingModule {}
