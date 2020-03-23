import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRouting } from './login-routing.module';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, ForgotPasswordComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    LoginRouting
  ]
})
export class LoginModule { }
