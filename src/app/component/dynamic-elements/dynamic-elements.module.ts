import { DynamicDialogComponent } from './dynamic-dialog/dynamic-dialog.component';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  GridModule,
  EditService,
  ToolbarService,
  SortService,
  FilterService,
  PageService,
  GroupService,
  ResizeService
} from "@syncfusion/ej2-angular-grids";

// components
import { DynamicGridComponent } from "./dynamic-grid/dynamic-grid.component";
import { DynamicFormsComponent } from "./dynamic-forms/dynamic-forms.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { DynamicFormsModule } from "./dynamic-forms/dynamic-forms.module";

@NgModule({
  declarations: [
    DynamicGridComponent,
    DynamicFormsComponent,
    DynamicDialogComponent,
  ],
  exports: [
    DynamicGridComponent,
    DynamicDialogComponent,
    GridModule,
    DialogModule
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormsModule
  ],
  providers: [EditService, ToolbarService, SortService, FilterService, PageService, GroupService, ResizeService],

})
export class DynamicElementsModule { }
