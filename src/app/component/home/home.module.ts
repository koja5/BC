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
import { FindConnectionComponent } from './find-connection/find-connection.component';
import { ContactComponent } from './contact/contact.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { FileUploadModule } from 'ng2-file-upload';
import { ConnectionFilterPipe } from './connection/connection.pipe';
import { RecommendationButtonComponent } from './recommendation-button/recommendation-button.component';
import { PromoVideoComponent } from './profile/promo-video/promo-video.component';
import { MatVideoModule } from 'mat-video';
import { AboutUsComponent } from './about-us/about-us.component';
import { EventsComponent } from './events/events.component';
import { LifeEventComponent } from './events/life-event/life-event.component';
import { FooterComponent } from './footer/footer.component';
import { LifeEventDetailsComponent } from './events/life-event/life-event-details/life-event-details.component';
import { EditEventComponent } from './events/edit-event/edit-event.component';
import { LifeComponent } from './events/edit-event/life/life.component';
import { VirtualComponent } from './events/edit-event/virtual/virtual.component';
import { VirtualEventComponent } from './events/virtual-event/virtual-event.component';
import { VirtualEventDetailsComponent } from './events/virtual-event/virtual-event-details/virtual-event-details.component';
import { RoomComponent } from './room/room.component';
import { WebcamModule } from 'ngx-webcam';
import { TakeCameraComponent } from './take-camera/take-camera.component';
import { RecordVideoComponent } from './record-video/record-video.component';
import { PopupComponent } from '../sub-components/popup/popup.component';

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
    FindConnectionComponent,
    ContactComponent,
    ConnectionFilterPipe,
    RecommendationButtonComponent,
    PromoVideoComponent,
    AboutUsComponent,
    EventsComponent,
    LifeEventComponent,
    LifeEventDetailsComponent,
    FooterComponent,
    EditEventComponent,
    LifeComponent,
    VirtualComponent,
    VirtualEventComponent,
    VirtualEventDetailsComponent,
    RoomComponent,
    TakeCameraComponent,
    RecordVideoComponent,
    PopupComponent
  ],
  exports: [
    TakeCameraComponent,
    LifeEventDetailsComponent
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
    FileUploadModule,
    MatVideoModule,
    WebcamModule
  ],
  entryComponents: [
    LifeEventDetailsComponent
  ],
})
export class HomeModule { }
