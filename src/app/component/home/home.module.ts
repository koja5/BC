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

@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    FeedComponent,
    MessageComponent,
    EditProfileComponent,
    ContentPlaceholderComponent,
    MyProfileComponent
  ],
  imports: [
    CommonModule,
    HomeRouting,
    FormsModule,
    DialogsModule,
    InputsModule,
    DateInputsModule
  ]
})
export class HomeModule { }
