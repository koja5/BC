import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRouting } from './login-routing.module';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FormsModule } from '@angular/forms';
import { ChooseDirectorComponent } from './signup/choose-director/choose-director.component';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';

@NgModule({
  declarations: [LoginComponent, SignupComponent, ForgotPasswordComponent, ChangePasswordComponent, ChooseDirectorComponent],
  imports: [
    CommonModule,
    LoginRouting,
    FormsModule,
    InputsModule,
    DropDownsModule
  ]
})
export class LoginModule { }
