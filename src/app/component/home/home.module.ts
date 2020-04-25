import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRouting } from './home-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { FeedComponent } from './feed/feed.component';
import { MessageComponent } from './message/message.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { FormsModule } from '@angular/forms';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ContentPlaceholderComponent } from './content-placeholder/content-placeholder.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { MyProfileComponent } from './profile/my-profile/my-profile.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { PremiumComponent } from './premium/premium.component';
import { ConnectionComponent } from './connection/connection.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { PrivacyPolicyComponent } from '../templates/privacy-policy/privacy-policy.component';
import { TermsComponent } from '../templates/terms/terms.component';
import { FindConnectionComponent } from './find-connection/find-connection.component';
import { ContactComponent } from './contact/contact.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { FileSelectDirective, FileDropDirective, FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    FeedComponent,
    MessageComponent,
    EditProfileComponent,
    ContentPlaceholderComponent,
    MyProfileComponent,
    PremiumComponent,
    ConnectionComponent,
    PrivacyPolicyComponent,
    TermsComponent,
    FindConnectionComponent,
    ContactComponent
  ],
  imports: [
    CommonModule,
    HomeRouting,
    FormsModule,
    DialogsModule,
    InputsModule,
    DateInputsModule,
    ImageCropperModule,
    DropDownsModule,
    ButtonsModule,
    FileUploadModule
  ]
})
export class HomeModule { }
