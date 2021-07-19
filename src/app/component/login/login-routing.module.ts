import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login.component";
import { SignupComponent } from "./signup/signup.component";
import { ChooseDirectorComponent } from "./signup/choose-director/choose-director.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { LoggedGuardService } from 'src/app/services/guard/logged-guard.service';

const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  },
  {
    path: "choose-director/:id",
    component: ChooseDirectorComponent
  },
  {
    path: "change-password/:id",
    component: ChangePasswordComponent,
    canActivate: [LoggedGuardService]
  },
  {
    path: "join-to/:id/:email/:firstname/:lastname",
    component: SignupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRouting { }
