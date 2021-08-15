import { LifeEventInviteFriendDialogComponent } from './../../../../modals/life-event-invite-friend-dialog/life-event-invite-friend-dialog.component';
import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LifeEventService } from "src/app/services/life-event.service";
import { ProfileService } from "src/app/services/profile.service";
import { HelpService } from "src/app/services/help.service";
import { EditEventService } from "src/app/services/edit-event.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DynamicDialogComponent } from "src/app/component/dynamic-elements/dynamic-dialog/dynamic-dialog.component";
import { ModalConfigurationService } from "src/app/services/modal-configuration.service";
import { ReminderFriendsDialogComponent } from 'src/app/component/modals/reminder-friends-dialog/reminder-friends-dialog.component';
import { InviteVirtualParticipantDialogComponent } from 'src/app/component/modals/invite-virtual-participant-dialog/invite-virtual-participant-dialog.component';
import { LifeEventMemberDetailsComponent } from 'src/app/component/modals/life-event-member-details/life-event-member-details.component';

@Component({
  selector: "app-life-event-details",
  templateUrl: "./life-event-details.component.html",
  styleUrls: ["./life-event-details.component.scss"],
})
export class LifeEventDetailsComponent implements OnInit {
  @Input() data: any;

  public id: any;
  public language: any;
  public eventStatus: any;
  public freeSpace = true;
  public numberOfFreeSpace: number;
  public organizator: any;
  public inviteFriendWindow = false;
  public allMyConnection: any;
  public currentLoadData: any;
  public memberGoingList: any;
  public registerLikeSpeaker = 0;
  public registerLikeListener = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: LifeEventService,
    private profileService: ProfileService,
    private helpService: HelpService,
    private editEventService: EditEventService,
    private modalService: NgbModal,
    private modalConfigurationService: ModalConfigurationService,
  ) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();
    this.initialization();
    console.log(this.data);
  }

  initialization() {
    this.id = this.route.snapshot.params.id;
    if (this.id) {
      this.editEventService.getEventData(this.id).subscribe((data) => {
        this.data = data;
        this.checkEventStatusForUser({
          _id: this.data._id,
          id_user: localStorage.getItem("id"),
        });
        this.checkFreeSpace();
        this.getOrganizatorProfile(data["id_user"]);
        const virtualParticipant = this.helpService.checkVirtualParticipant(
          data,
          this.registerLikeSpeaker,
          this.registerLikeListener
        );
        if (virtualParticipant) {
          if (virtualParticipant.type === "speaker") {
            this.registerLikeSpeaker = virtualParticipant.value;
          } else {
            this.registerLikeListener = virtualParticipant.value;
          }
        }
      });
    }
  }

  checkEventStatusForUser(data) {
    this.service.checkEventStatusForUser(data).subscribe((data: boolean) => {
      this.eventStatus = data;
    });
  }

  editEvent() {
    this.router.navigate(["home/main/event/edit-event/life/" + this.data._id]);
  }

  openAreYouSureDialog(): void {
    const modalRef = this.modalService.open(DynamicDialogComponent, {
      size: 'lg',
      centered: true
    });

    this.modalConfigurationService.setSettingsForAreYouSureDialog(modalRef.componentInstance, this.language);
    modalRef.componentInstance.modal = modalRef;

    modalRef.result.then(() => {
      this.deleteEvent();
    }, () => {
      console.log(`Dismissed`)
    });
  }

  deleteEvent(): void {
    this.editEventService.deleteEventData(this.data._id).subscribe((data) => {
      if (data) {
        this.helpService.deleteSuccessMessage();
        this.router.navigate(["/home/main/event/all"]);
      } else {
        this.helpService.deleteErrorMessage();
      }
    });
  }

  signIn() {
    const data = {
      id: this.data._id,
      user_id: localStorage.getItem("id"),
    };

    this.service.signInForEvent(data).subscribe((data) => {
      console.log(data);
      this.eventStatus = data;
      if (data === 1) {
        this.data.signIn.length++;
        this.numberOfFreeSpace--;
      } else {
        this.data.signIn.length--;
        this.numberOfFreeSpace++;
      }
      this.checkFreeSpace();
    });
  }

  checkFreeSpace() {
    this.numberOfFreeSpace =
      Number(this.data.attendees) - Number(this.data.signIn.length);
    if (this.numberOfFreeSpace > 0) {
      this.freeSpace = true;
    } else {
      this.freeSpace = false;
    }
  }

  getOrganizatorProfile(id) {
    this.profileService.getUserInfoSHA1(id).subscribe((data) => {
      this.organizator = data[0];
      console.log(this.organizator);
    });
  }

  openInviteFriendsDialog() {
    const modalRef = this.modalService.open(LifeEventInviteFriendDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.lifeEventInviteFriend,
        text: () => null,
        imageUrl: () => null,
        imageStyle: () => null,
        primaryButtonLabel: () => null,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;
    modalRef.componentInstance.id = this.id;
  }

  openInviteVirtualParticipantDialog() {
    const modalRef = this.modalService.open(InviteVirtualParticipantDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.recommendedTitle,
        text: () => null,
        imageUrl: () => null,
        imageStyle: () => null,
        primaryButtonLabel: () => null,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;
    modalRef.componentInstance.id = this.id;
    modalRef.componentInstance.data = this.data;
  }


  showGoingList() {
    this.service.getSignInForLifeEvent(this.id).subscribe((data) => {
      console.log(data);
      if (data) {
        this.memberGoingList = data;
        this.openLifeEventMemberDetailsDialog();
      }
    });
  }

  showSpeakersConfirm() {
    this.memberGoingList = this.data.speakersConfirm;
    this.openLifeEventMemberDetailsDialog();

  }

  showListenersConfirm() {
    this.memberGoingList = this.data.listenersConfirm;
    this.openLifeEventMemberDetailsDialog();
  }


  signInVirtualParticipant(type) {
    /*const value = this.helpService.signInVirtualParticipant(type, this.id);
    if (type === "speakers") {
      this.registerLikeSpeaker = value;
    } else {
      this.registerLikeListener = value;
    }*/
  }

  public openReminderFriendsDialog(): void {
    const modalRef = this.modalService.open(ReminderFriendsDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.reminderFriendsForEventSendReminder,
        text: () => null,
        imageUrl: () => null,
        imageStyle: () => null,
        primaryButtonLabel: () => null,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;
    modalRef.componentInstance.id = this.id;
  }

  public openLifeEventMemberDetailsDialog(): void {
    const modalRef = this.modalService.open(LifeEventMemberDetailsComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.lifeEventDetailsMemberGoing,
        text: () => null,
        imageUrl: () => null,
        imageStyle: () => null,
        primaryButtonLabel: () => null,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;
    modalRef.componentInstance.memberGoingList = this.memberGoingList;
  }
}
