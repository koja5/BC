import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateEventComponent } from './create-event/create-event.component';
import { DynamicElementsModule } from '../dynamic-elements/dynamic-elements.module';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { FormsModule } from '@angular/forms';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ExperienceDialogComponent } from './experience-dialog/experience-dialog.component';
import { EducationDialogComponent } from './education-dialog/education-dialog.component';

@NgModule({
    declarations: [
        CreateEventComponent,
        ChangePasswordDialogComponent,
        ExperienceDialogComponent,
        EducationDialogComponent
    ],
    imports: [
        CommonModule,
        DynamicElementsModule,
        FormsModule,
        DateInputsModule
    ],
    exports: [
        CreateEventComponent,
        ChangePasswordDialogComponent,
        ExperienceDialogComponent,
        EducationDialogComponent
    ],
    entryComponents: [
        CreateEventComponent,
        ChangePasswordDialogComponent,
        ExperienceDialogComponent,
        EducationDialogComponent
    ]
})
export class ModalsModule { }
