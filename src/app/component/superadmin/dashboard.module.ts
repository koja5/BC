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
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';

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
    InputsModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class DashboardModule { }
