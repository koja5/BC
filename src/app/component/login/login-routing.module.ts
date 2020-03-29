import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup/signup.component';
import { ChooseDirectorComponent } from './signup/choose-director/choose-director.component';

const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'choose-director/:id', component: ChooseDirectorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRouting { }
