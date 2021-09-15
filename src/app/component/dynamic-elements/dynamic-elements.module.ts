import { DynamicDialogComponent } from './dynamic-dialog/dynamic-dialog.component';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// components
import { DynamicGridComponent } from "./dynamic-grid/dynamic-grid.component";
import { DynamicFormsComponent } from "./dynamic-forms/dynamic-forms.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DynamicFormsModule } from "./dynamic-forms/dynamic-forms.module";

@NgModule({
  declarations: [
    DynamicGridComponent,
    DynamicFormsComponent,
    DynamicDialogComponent
  ],
  exports: [
    DynamicGridComponent,
    DynamicDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormsModule
  ],

})
export class DynamicElementsModule { }
