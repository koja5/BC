import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFieldsDirective } from './dynamic-fields/dynamic-fields.directive';
import { DropdownComponent } from "./dynamic-fields/dropdown/dropdown.component";
import { TextboxComponent } from './dynamic-fields/textbox/textbox.component';
import { TextareaComponent } from './dynamic-fields/textarea/textarea.component';
import { NumericComponent } from './dynamic-fields/numeric/numeric.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatepickerComponent } from './dynamic-fields/datepicker/datepicker.component';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ButtonComponent } from './dynamic-fields/button/button.component';

@NgModule({
  declarations: [
    DynamicFieldsDirective,
    DropdownComponent,
    TextboxComponent,
    TextareaComponent,
    NumericComponent,
    DatepickerComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    DynamicFieldsDirective,
    TextBoxModule,
    DropDownListModule,
    DatePickerModule
  ],

})
export class DynamicFormsModule { }
