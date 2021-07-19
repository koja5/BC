import { ModalsModule } from './component/modals/modals.module';
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule, HttpClientJsonpModule } from "@angular/common/http";
import { ToastrModule } from "ngx-toastr";
import { LoadingBarRouterModule } from "@ngx-loading-bar/router";
import { DashboardModule } from "./component/superadmin/dashboard.module";
import { SplitterModule, LayoutModule } from "@progress/kendo-angular-layout";
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// services
import { LoggedGuardService } from "./services/guard/logged-guard.service";
import { DashboardGuardService } from "./services/guard/dashboard-guard.service";
import { LoginGuardService } from "./services/guard/login-guard.service";
import { CookieService } from "ng2-cookies";
import { MailService } from "./services/mail.service";

//dashboard
import { AppComponent } from "./app.component";
import { PrivacyPolicyComponent } from "./component/templates/privacy-policy/privacy-policy.component";
import { TermsComponent } from "./component/templates/terms/terms.component";
import { MaintenceComponent } from './component/templates/maintence/maintence.component';
import { ImpressumComponent } from './component/templates/impressum/impressum.component';
import { RecommendedAnswerComponent } from './component/templates/recommended-answer/recommended-answer.component';
import { NotFoundComponent } from "./component/templates/not-found/not-found.component";
import { SuccessComponent } from './component/templates/success/success.component';
import { DynamicElementsModule } from "./component/dynamic-elements/dynamic-elements.module";
import { DemoComponent } from "./component/demo/demo.component";

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    PrivacyPolicyComponent,
    TermsComponent,
    MaintenceComponent,
    ImpressumComponent,
    RecommendedAnswerComponent,
    SuccessComponent,
    DemoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DashboardModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ToastrModule.forRoot(),
    LoadingBarRouterModule,
    LayoutModule,
    SplitterModule,
    DialogsModule,
    DynamicElementsModule,
    NgbModule,
    ModalsModule
  ],
  providers: [
    LoggedGuardService,
    CookieService,
    LoginGuardService,
    DashboardGuardService,
    MailService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
