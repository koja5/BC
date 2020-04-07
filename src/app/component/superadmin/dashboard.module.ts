import { NgModule } from "@angular/core";
import { DashboardRouting } from "./dashboard-routing.module";
import { CommonModule } from '@angular/common';
import { MaterialDesignFrameworkModule } from 'angular6-json-schema-form';
import { TranslationComponent } from "./translation/translation.component";
import { MembersComponent } from "./members/members.component";

import { MatCardModule, MatToolbarModule } from "@angular/material";
import { EditTranslationComponent } from "./translation/edit/edit-translation.component";
import { CustomGridComponent } from "./custom-grid/custom-grid.component";
import {
  GridModule,
  ExcelModule,
  PDFModule,
} from "@progress/kendo-angular-grid";
import { FormsModule } from "@angular/forms";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { IntlModule } from "@progress/kendo-angular-intl";
import { DialogModule } from "@progress/kendo-angular-dialog";
import { DialogsModule } from "@progress/kendo-angular-dialog";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { CustomGridService } from "../../services/custom-grid.service";
import { DashboardComponent } from "./dashboard.component";
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
} from "ngx-perfect-scrollbar";
import { ModalModule } from "ngx-modal";
import { SplitterModule, LayoutModule } from "@progress/kendo-angular-layout";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  declarations: [
    DashboardComponent,
    TranslationComponent,
    MembersComponent,
    EditTranslationComponent,
    CustomGridComponent,
  ],
  imports: [
    CommonModule,
    DashboardRouting,
    MatCardModule,
    MatToolbarModule,
    GridModule,
    FormsModule,
    InputsModule,
    IntlModule,
    DropDownsModule,
    DialogModule,
    ExcelModule,
    PDFModule,
    DialogsModule,
    DateInputsModule,
    ButtonsModule,
    MaterialDesignFrameworkModule,
    PerfectScrollbarModule,
    ModalModule,
    LayoutModule,
    SplitterModule,
  ],
  providers: [
    CustomGridService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
})
export class DashboardModule {}
