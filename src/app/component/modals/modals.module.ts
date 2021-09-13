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
import { LifeEventInviteFriendDialogComponent } from './life-event-invite-friend-dialog/life-event-invite-friend-dialog.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ReminderFriendsDialogComponent } from './reminder-friends-dialog/reminder-friends-dialog.component';
import { InviteVirtualParticipantDialogComponent } from './invite-virtual-participant-dialog/invite-virtual-participant-dialog.component';
import { LifeEventMemberDetailsComponent } from './life-event-member-details/life-event-member-details.component';
import { LifeEventDetailsDialogComponent } from './life-event-details-dialog/life-event-details-dialog.component';
import { VirtualEventInviteFriendDialogComponent } from './virtual-event-invite-friend-dialog/virtual-event-invite-friend-dialog.component';
import { FeedPostLikesDialogComponent } from './feed-post-likes-dialog/feed-post-likes-dialog.component';
import { FeedInviteDialogComponent } from './feed-invite-dialog/feed-invite-dialog.component';
import { PreviewPostDialogComponent } from './preview-post-dialog/preview-post-dialog.component';
import { RecommendedDialogComponent } from './recommended-dialog/recommended-dialog.component';
import { ContactFormDialogComponent } from './contact-form-dialog/contact-form-dialog.component';
import { CreateEventTypeDialogComponent } from './create-event-type-dialog/create-event-type-dialog.component';
import { CreateNewCustomerDialogComponent } from './create-new-customer-dialog/create-new-customer-dialog.component';
import { PremiumBuyDialogComponent } from './premium-buy-dialog/premium-buy-dialog.component';
import { PromoVideoComponent } from './promo-video/promo-video.component';
import { RecordCameraDialogComponent } from './record-camera-dialog/record-camera-dialog.component';

@NgModule({
    declarations: [
        CreateEventComponent,
        ChangePasswordDialogComponent,
        ExperienceDialogComponent,
        EducationDialogComponent,
        ImageCropperDialogComponent,
        FileUploadDialogComponent,
        TakeCameraDialogComponent,
        LifeEventInviteFriendDialogComponent,
        ReminderFriendsDialogComponent,
        InviteVirtualParticipantDialogComponent,
        LifeEventMemberDetailsComponent,
        LifeEventDetailsDialogComponent,
        VirtualEventInviteFriendDialogComponent,
        FeedPostLikesDialogComponent,
        FeedInviteDialogComponent,
        PreviewPostDialogComponent,
        RecommendedDialogComponent,
        ContactFormDialogComponent
    ],
    imports: [
        CommonModule,
        DynamicElementsModule,
        FormsModule,
        DateInputsModule,
        ImageCropperModule,
        FileUploadModule,
        WebcamModule,
        HomeModule,
        InputsModule,
        DropDownsModule
    ],
    exports: [
        CreateEventComponent,
        ChangePasswordDialogComponent,
        ExperienceDialogComponent,
        EducationDialogComponent,
        ImageCropperDialogComponent,
        FileUploadDialogComponent,
        TakeCameraDialogComponent,
        LifeEventInviteFriendDialogComponent,
        ReminderFriendsDialogComponent,
        InviteVirtualParticipantDialogComponent,
        LifeEventMemberDetailsComponent,
        LifeEventDetailsDialogComponent,
        VirtualEventInviteFriendDialogComponent,
        FeedPostLikesDialogComponent,
        FeedInviteDialogComponent
    ],
    entryComponents: [
        CreateEventComponent,
        ChangePasswordDialogComponent,
        ExperienceDialogComponent,
        EducationDialogComponent,
        ImageCropperDialogComponent,
        FileUploadDialogComponent,
        TakeCameraDialogComponent,
        LifeEventInviteFriendDialogComponent,
        ReminderFriendsDialogComponent,
        InviteVirtualParticipantDialogComponent,
        LifeEventMemberDetailsComponent,
        LifeEventDetailsDialogComponent,
        VirtualEventInviteFriendDialogComponent,
        FeedPostLikesDialogComponent,
        FeedInviteDialogComponent,
        PremiumBuyDialogComponent,
        RecordCameraDialogComponent,
        PromoVideoComponent,
        CreateEventTypeDialogComponent,
        CreateNewCustomerDialogComponent,
        RecommendedDialogComponent,
        ContactFormDialogComponent
    ]
})
export class ModalsModule { }
