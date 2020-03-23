import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './component/templates/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'login', loadChildren: './component/login/login.module#LoginModule'
  },
  {
    path: 'dashboard', loadChildren: './component/superadmin/dashboard.module#DashboardModule'
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
