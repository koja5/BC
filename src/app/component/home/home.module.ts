import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRouting } from './home-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { FeedComponent } from './feed/feed.component';
import { MessageComponent } from './message/message.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    FeedComponent,
    MessageComponent,
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    HomeRouting
  ]
})
export class HomeModule { }
