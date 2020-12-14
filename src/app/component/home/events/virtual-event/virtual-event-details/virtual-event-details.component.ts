import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LifeEventService } from "src/app/services/life-event.service";
import { ProfileService } from "src/app/services/profile.service";
import { ConnectionService } from "src/app/services/connection.service";
import { ToastrService } from "ngx-toastr";
import * as sha1 from "sha1";
import { HelpService } from "src/app/services/help.service";
import { EditEventService } from "src/app/services/edit-event.service";
import { SetPackagesService } from "src/app/services/help-services/set-packages.service";
import { PrepareMailService } from "src/app/services/help-services/prepare-mail.service";

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
  public deleteEventWindow = false;
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
  public inviteVirtualParticipantWindow = false;
  public inviteVirtualParticipantWindowMessage: any;
  public typeOfVirtualParticipant = "speakers";
  public selectedSpeakers: any;
  public selectedListeners: any;
  public registerLikeSpeaker = 0;
  public registerLikeListener = 0;
  public memberGoingWindow = false;
  public popupInd = false;
  public popupTitle: any;
  public popupText: any;
  public functionNameYes: string;
  public functionNameNo: string;
  public userType: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: LifeEventService,
    private profileService: ProfileService,
    private connectionService: ConnectionService,
    private toastr: ToastrService,
    private helpService: HelpService,
    private editEventService: EditEventService,
    private setPackages: SetPackagesService,
    private prepareMail: PrepareMailService
  ) {}

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

  deleteEvent(answer) {
    if (answer === "yes") {
      this.editEventService.deleteEventData(this.data._id).subscribe((data) => {
        if (data) {
          this.helpService.deleteSuccessMessage();
          this.router.navigate(["/home/main/event/all"]);
        } else {
          this.helpService.deleteErrorMessage();
        }
      });
    }

    this.deleteEventWindow = false;
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
    this.prepareMail.sendInviteForSelectedFriends(
      this.language,
      this.selectedInviteFriends,
      this.id
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

  openProfile(id) {
    this.router.navigate(["/home/main/profile/" + sha1(id.toString())]);
  }

  goToRoom() {
    // this.router.navigate(["/home/main/room/" + this.id, "_blank"]);
    window.open("/home/main/room/" + this.id, "_blank");
  }

  setReminder() {
    this.reminderFriendsWindow = true;
    this.service.getSignInForLifeEvent(this.id).subscribe((data) => {
      console.log(data);
      if (data) {
        this.allMyConnection = data;
        this.currentLoadData = data;
        this.selectedReminderFriends = data;
      }
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
    this.memberGoingWindow = true;
  }

  showListenersGoing() {
    this.memberGoingList = this.data.listeners;
    this.memberGoingWindow = true;
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
