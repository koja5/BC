import { VirtualEventInviteFriendDialogComponent } from './../../../../modals/virtual-event-invite-friend-dialog/virtual-event-invite-friend-dialog.component';
import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LifeEventService } from "src/app/services/life-event.service";
import { ProfileService } from "src/app/services/profile.service";
import { ConnectionService } from "src/app/services/connection.service";
import * as sha1 from "sha1";
import { HelpService } from "src/app/services/help.service";
import { EditEventService } from "src/app/services/edit-event.service";
import { PrepareMailService } from "src/app/services/help-services/prepare-mail.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DynamicDialogComponent } from "src/app/component/dynamic-elements/dynamic-dialog/dynamic-dialog.component";
import { ModalConfigurationService } from "src/app/services/modal-configuration.service";
import { InviteVirtualParticipantDialogComponent } from 'src/app/component/modals/invite-virtual-participant-dialog/invite-virtual-participant-dialog.component';
import { ReminderFriendsDialogComponent } from 'src/app/component/modals/reminder-friends-dialog/reminder-friends-dialog.component';
import { LifeEventMemberDetailsComponent } from 'src/app/component/modals/life-event-member-details/life-event-member-details.component';

@Component({
  selector: "app-virtual-event-details",
  templateUrl: "./virtual-event-details.component.html",
  styleUrls: ["./virtual-event-details.component.scss"],
})
export class VirtualEventDetailsComponent implements OnInit {
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
  public selectedInviteFriends = [];
  public memberGoingList: any;
  public reminderFriendsWindow = false;
  public selectedReminderFriends: any;
  public owner = false;
  public typeOfVirtualParticipant = "speakers";
  public selectedSpeakers: any;
  public selectedListeners: any;
  public registerLikeSpeaker = 0;
  public registerLikeListener = 0;
  public popupInd = false;
  public popupTitle: any;
  public popupText: any;
  public functionNameYes: string;
  public functionNameNo: string;
  public userType: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private helpService: HelpService,
    private editEventService: EditEventService,
    private prepareMail: PrepareMailService,
    private modalService: NgbModal,
    private modalConfigurationService: ModalConfigurationService
  ) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();
    this.initialization();
    console.log(this.data);
  }

  initialization() {
    this.id = this.route.snapshot.params.id;
    this.registerLikeSpeaker = 0;
    this.registerLikeListener = 0;
    if (this.id) {
      this.editEventService.getEventData(this.id).subscribe((data) => {
        this.data = data;
        console.log(data);
        this.owner = this.checkEventStatusForUser(this.data.id_user);
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

  checkEventStatusForUser(id_user) {
    if (id_user === localStorage.getItem("id")) {
      return true;
    } else {
      return false;
    }
  }

  editEvent() {
    this.router.navigate([
      "home/main/event/edit-event/virtual/" + this.data._id,
    ]);
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

  deleteEvent() {
    this.editEventService.deleteEventData(this.data._id).subscribe((data) => {
      if (data) {
        this.helpService.deleteSuccessMessage();
        this.router.navigate(["/home/main/event/all"]);
      } else {
        this.helpService.deleteErrorMessage();
      }
    });
  }

  getOrganizatorProfile(id) {
    this.profileService.getUserInfoSHA1(id).subscribe((data) => {
      this.organizator = data[0];
      console.log(this.organizator);
    });
  }

  openInviteFriendsWindow(): void {
    const modalRef = this.modalService.open(VirtualEventInviteFriendDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.virtualEventInviteFriend,
        text: () => null,
        imageUrl: () => null,
        primaryButtonLabel: () => null,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;
    modalRef.componentInstance.id = this.id;
  }

  isItemSelectedReminder(itemText: string): boolean {
    return this.selectedReminderFriends.some((item) => item.id === itemText);
  }


  sendReminderForSelectedFriends() {
    this.prepareMail.sendReminderForSelectedFriends(
      this.language,
      this.selectedReminderFriends,
      this.id
    );
    this.reminderFriendsWindow = false;
  }

  selectAllMyReminderFriends() {
    if (this.selectedReminderFriends.length !== this.currentLoadData.length) {
      this.selectedReminderFriends = this.currentLoadData;
    } else {
      this.selectedReminderFriends = [];
    }
  }

  openProfile(id) {
    this.router.navigate(["/home/main/profile/" + sha1(id.toString())]);
  }

  goToRoom() {
    // this.router.navigate(["/home/main/room/" + this.id, "_blank"]);
    window.open("/home/main/room/" + this.id, "_blank");
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

  openInviteVirtualParticipantDialog(): void {
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

  sendInviteForSelectedVirtualParticipant(type) {
    this.prepareMail.sendInviteForSelectedVirtualParticipant(
      type,
      this.language,
      this.id,
      this.selectedSpeakers,
      this.selectedListeners,
      this.data
    );
    this.inviteFriendWindow = false;
  }

  showSpeakersGoing() {
    this.memberGoingList = this.data.speakers;
    this.openLifeEventMemberDetailsDialog();
  }

  showListenersGoing() {
    this.memberGoingList = this.data.listeners;
    this.openLifeEventMemberDetailsDialog();
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

  signInVirtualParticipant(type) {
    this.signIn(type, this.id);
  }

  signOutVirtualParticipant(type) {
    this.signOut(type, this.id);
  }

  openDialogSignInOutAction(
    title = false,
    text = false,
    functionNameYes,
    functionNameNo,
    type
  ) {
    this.popupTitle = title;
    this.popupText = text;
    this.popupInd = true;
    this.functionNameYes = functionNameYes;
    this.functionNameNo = functionNameNo;
    this.userType = type;
  }

  OpenDialogEvent(event) {
    if (event.answer) {
      if (event.functionNameYes) {
        this[event.functionNameYes](this.userType);
      }
    } else {
      if (event.functionNameNo) {
        this[event.functionNameNo](this.userType);
      }
    }
    this.popupInd = false;
  }

  signIn(type, id) {
    this.data = null;
    this.profileService.getUserInfoSHA1(localStorage.getItem("id")).subscribe(
      (user) => {
        const data = {
          id: id,
          type: type,
          participant: user[0],
        };
        this.editEventService.signInVirtualParticipant(data).subscribe(
          (data) => {
            if (data) {
              this.helpService.updateSuccessMessage();
              this.initialization();
            }
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  signOut(type, id) {
    this.data = null;
    this.profileService.getUserInfoSHA1(localStorage.getItem("id")).subscribe(
      (user) => {
        const data = {
          id: id,
          type: type,
          participant: user[0],
        };
        this.editEventService.signOutVirtualParticipant(data).subscribe(
          (data) => {
            if (data) {
              this.helpService.updateSuccessMessage();
              this.initialization();
            }
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
