import { HomeModule } from './../home/home.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateEventComponent } from './create-event/create-event.component';
import { DynamicElementsModule } from '../dynamic-elements/dynamic-elements.module';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { FormsModule } from '@angular/forms';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ExperienceDialogComponent } from './experience-dialog/experience-dialog.component';
import { EducationDialogComponent } from './education-dialog/education-dialog.component';
import { ImageCropperDialogComponent } from './image-cropper-dialog/image-cropper-dialog.component';
import { FileUploadDialogComponent } from './file-upload-dialog/file-upload-dialog.component';
import { TakeCameraDialogComponent } from './take-camera-dialog/take-camera-dialog.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageCropperModule } from 'ngx-image-cropper';
import { WebcamModule } from 'ngx-webcam';

@NgModule({
    declarations: [
        CreateEventComponent,
        ChangePasswordDialogComponent,
        ExperienceDialogComponent,
        EducationDialogComponent,
        ImageCropperDialogComponent,
        FileUploadDialogComponent,
        TakeCameraDialogComponent
    ],
    imports: [
        CommonModule,
        DynamicElementsModule,
        FormsModule,
        DateInputsModule,
        ImageCropperModule,
        FileUploadModule,
        WebcamModule,
        HomeModule
    ],
    exports: [
        CreateEventComponent,
        ChangePasswordDialogComponent,
        ExperienceDialogComponent,
        EducationDialogComponent,
        ImageCropperDialogComponent,
        FileUploadDialogComponent,
        TakeCameraDialogComponent
    ],
    entryComponents: [
        CreateEventComponent,
        ChangePasswordDialogComponent,
        ExperienceDialogComponent,
        EducationDialogComponent,
        ImageCropperDialogComponent,
        FileUploadDialogComponent,
        TakeCameraDialogComponent
    ]
})
export class ModalsModule { }
