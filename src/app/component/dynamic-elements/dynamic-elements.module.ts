import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DynamicDialogComponent } from './dynamic-dialog/dynamic-dialog.component';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// components
import { DynamicGridComponent } from "./dynamic-grid/dynamic-grid.component";
import { DynamicFormsComponent } from "./dynamic-forms/dynamic-forms.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DynamicFormsModule } from "./dynamic-forms/dynamic-forms.module";
import { GridModule } from '@progress/kendo-angular-grid';

@NgModule({
  declarations: [
    DynamicGridComponent,
    DynamicFormsComponent,
    DynamicDialogComponent,
  ],
  exports: [
    DynamicGridComponent,
    DynamicDialogComponent,
    GridModule
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormsModule,
    DropDownsModule
  ],

})
export class DynamicElementsModule { }
