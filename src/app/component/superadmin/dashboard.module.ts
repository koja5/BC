import { NgModule } from "@angular/core";
import { DashboardRouting } from "./dashboard-routing.module";
import { CommonModule } from '@angular/common';
import { TranslationComponent } from "./translation/translation.component";
import { MembersComponent } from "./members/members.component";
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
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
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { CustomGridService } from "../../services/custom-grid.service";
import { DashboardComponent } from "./dashboard.component";
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
} from "ngx-perfect-scrollbar";
import { SplitterModule, LayoutModule } from "@progress/kendo-angular-layout";
import { EventComponent } from './parameters/event/event.component';
import { TodoComponent } from './todo/todo.component';
import { DynamicElementsModule } from "../dynamic-elements/dynamic-elements.module";
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
    EventComponent,
    TodoComponent,

  ],
  imports: [
    CommonModule,
    DashboardRouting,
    MatCardModule,
    MatToolbarModule,
    FormsModule,
    InputsModule,
    IntlModule,
    DropDownsModule,
    ExcelModule,
    PDFModule,
    DateInputsModule,
    ButtonsModule,
    PerfectScrollbarModule,
    LayoutModule,
    SplitterModule,
    DynamicElementsModule
  ],
  exports: [
    GridModule
  ],
  providers: [
    CustomGridService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
})
export class DashboardModule { }
