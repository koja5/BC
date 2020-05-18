import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NotFoundComponent } from "./component/templates/not-found/not-found.component";

import { HttpModule } from "@angular/http";
import { HttpClientModule, HttpClientJsonpModule } from "@angular/common/http";
import { ToastrModule } from "ngx-toastr";
import { LoadingBarRouterModule } from "@ngx-loading-bar/router";
import { LoggedGuard } from "./services/guard/logged-guard.service";
import { DashboardGuard } from "./services/guard/dashboard-guard.service";
import { LoginGuard } from "./services/guard/login-guard.service";
import { CookieService } from "ng2-cookies";
import { MailService } from "./services/mail.service";
import { DashboardModule } from "./component/superadmin/dashboard.module";
import { SplitterModule, LayoutModule } from "@progress/kendo-angular-layout";
import { PrivacyPolicyComponent } from "./component/templates/privacy-policy/privacy-policy.component";
import { TermsComponent } from "./component/templates/terms/terms.component";
import { MaintenceComponent } from './component/templates/maintence/maintence.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    PrivacyPolicyComponent,
    TermsComponent,
    MaintenceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DashboardModule,
    HttpModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ToastrModule.forRoot(),
    LoadingBarRouterModule,
    LayoutModule,
    SplitterModule,
  ],
  providers: [
    LoggedGuard,
    CookieService,
    LoginGuard,
    DashboardGuard,
    MailService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
