import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NotFoundComponent } from "./component/templates/not-found/not-found.component";

import { HttpModule } from "@angular/http";
import { HttpClientModule, HttpClientJsonpModule } from "@angular/common/http";
import { ToastrModule } from 'ngx-toastr';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { MatProgressBarModule, MatProgressSpinnerModule } from '@angular/material';
import { LoggedGuard } from './services/guard/logged-guard.service';
import { DashboardGuard } from './services/guard/dashboard-guard.service';
import { LoginGuard } from './services/guard/login-guard.service';
import { CookieService } from 'ng2-cookies';
import { MailService } from './services/mail.service';

@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ToastrModule.forRoot(),
    LoadingBarRouterModule
  ],
  providers: [
    LoggedGuard,
    CookieService,
    LoginGuard,
    DashboardGuard,
    MailService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
