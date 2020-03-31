import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRouting } from './dashboard-routing.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { ModalModule } from 'ngx-modal';
import { LayoutModule, SplitterModule } from '@progress/kendo-angular-layout';
import { TranslationComponent } from './translation/translation.component';
import { MembersComponent } from './members/members.component';
import {
  JsonSchemaFormModule, MaterialDesignFrameworkModule
} from 'angular2-json-schema-form';
import { MatCardModule, MatToolbarModule } from '@angular/material';
import { EditTranslationComponent } from './translation/edit/edit-translation.component';
import { CustomGridComponent } from './custom-grid/custom-grid.component';
import { GridModule, ExcelModule, PDFModule } from '@progress/kendo-angular-grid';
import { FormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { IntlModule } from '@progress/kendo-angular-intl';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { CustomGridService } from '../../services/custom-grid.service';

@NgModule({
  declarations: [DashboardComponent, TranslationComponent, MembersComponent, EditTranslationComponent, CustomGridComponent],
  imports: [
    CommonModule,
    DashboardRouting,
    PerfectScrollbarModule,
    ModalModule,
    LayoutModule,
    SplitterModule, 
    MaterialDesignFrameworkModule,
    JsonSchemaFormModule.forRoot(
      MaterialDesignFrameworkModule
    ),
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
    ButtonsModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    CustomGridService
  ]
})
export class DashboardModule { }
