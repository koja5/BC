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
  public selectedInviteFriends = [];
  public memberGoingWindow = false;
  public memberGoingList: any;
  public reminderFriendsWindow = false;
  public selectedReminderFriends: any;
  public inviteVirtualParticipantWindow = false;
  public inviteVirtualParticipantWindowMessage: any;
  public typeOfVirtualParticipant = "speakers";
  public selectedSpeakers: any;
  public selectedListeners: any;
  public registerLikeSpeaker = 0;
  public registerLikeListener = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: LifeEventService,
    private profileService: ProfileService,
    private connectionService: ConnectionService,
    private helpService: HelpService,
    private editEventService: EditEventService,
    private prepareMail: PrepareMailService,
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

  openInviteFriendsWindow() {
    this.inviteFriendWindow = true;
    this.connectionService
      .getAllMyConnections(localStorage.getItem("id"))
      .subscribe((data) => {
        this.allMyConnection = data;
        this.currentLoadData = data;
      });
  }

  openInviteVirtualParticipantWindow() {
    this.inviteVirtualParticipantWindow = true;
    if (this.typeOfVirtualParticipant === "speakers") {
      this.inviteVirtualParticipantWindowMessage = this.language.inviteVirtualParticipantSpeakerForEventMessage;
    } else {
      this.inviteVirtualParticipantWindowMessage = this.language.inviteVirtualParticipantListenerForEventMessage;
    }
    this.connectionService
      .getAllMyConnections(localStorage.getItem("id"))
      .subscribe((data) => {
        this.allMyConnection = data;
        this.currentLoadData = data;
      });
  }

  isItemSelected(itemText: string): boolean {
    return this.selectedInviteFriends.some((item) => item.id === itemText);
  }

  isItemSelectedReminder(itemText: string): boolean {
    return this.selectedReminderFriends.some((item) => item.id === itemText);
  }

  handleFilter(value) {
    this.allMyConnection = this.currentLoadData.filter(
      (s) => s.fullname.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  sendInviteForSelectedFriends() {
    this.prepareMail.sendReminderForSelectedFriends(
      this.language,
      this.selectedReminderFriends,
      this.id
    );
    this.inviteFriendWindow = false;
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

  sendReminderForSelectedFriends() {
    this.prepareMail.sendReminderForSelectedFriends(
      this.language,
      this.selectedReminderFriends,
      this.id
    );
    this.reminderFriendsWindow = false;
  }

  selectAllMyFriends() {
    if (this.selectedInviteFriends.length !== this.currentLoadData.length) {
      this.selectedInviteFriends = this.currentLoadData;
    } else {
      this.selectedInviteFriends = [];
    }
  }

  selectAllMyReminderFriends() {
    if (this.selectedReminderFriends.length !== this.currentLoadData.length) {
      this.selectedReminderFriends = this.currentLoadData;
    } else {
      this.selectedReminderFriends = [];
    }
  }

  showGoingList() {
    this.service.getSignInForLifeEvent(this.id).subscribe((data) => {
      console.log(data);
      if (data) {
        this.memberGoingList = data;
        this.memberGoingWindow = true;
      }
    });
  }

  showSpeakersConfirm() {
    this.memberGoingList = this.data.speakersConfirm;
    this.memberGoingWindow = true;
  }

  showListenersConfirm() {
    this.memberGoingList = this.data.listenersConfirm;
    this.memberGoingWindow = true;
  }

  openProfile(id) {
    this.router.navigate(["/home/main/profile/" + sha1(id.toString())]);
  }

  setReminder() {
    this.service.getSignInForLifeEvent(this.id).subscribe((data) => {
      console.log(data);
      if (data) {
        this.allMyConnection = data;
        this.currentLoadData = data;
        this.selectedReminderFriends = data;
        this.reminderFriendsWindow = true;
      }
    });
  }

  signInVirtualParticipant(type) {
    /*const value = this.helpService.signInVirtualParticipant(type, this.id);
    if (type === "speakers") {
      this.registerLikeSpeaker = value;
    } else {
      this.registerLikeListener = value;
    }*/
  }
}
