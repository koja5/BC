import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LifeEventService } from "src/app/services/life-event.service";
import { ProfileService } from "src/app/services/profile.service";
import { ConnectionService } from "src/app/services/connection.service";
import { ToastrService } from "ngx-toastr";
import * as sha1 from "sha1";
import { HelpService } from "src/app/services/help.service";
import { EditEventService } from "src/app/services/edit-event.service";
import { type } from 'os';

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
  public deleteEventWindow = false;
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
  public typeOfVirtualParticipant = 'speakers';
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
    private toastr: ToastrService,
    private helpService: HelpService,
    private editEventService: EditEventService
  ) { }

  ngOnInit() {
    this.language = JSON.parse(localStorage.getItem("language"));
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
        this.checkVirtualParticipant(data);
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
    if (this.typeOfVirtualParticipant === 'speakers') {
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
    const data = {
      inviter_id: localStorage.getItem("id"),
      inviter_fullname: JSON.parse(localStorage.getItem("user"))["fullname"],
      event_id: this.id,
      friends: this.packSelectedMemberToList(this.selectedInviteFriends),
      language: this.packLanguageForInvite(),
    };

    this.service.sendInviteForEvent(data).subscribe((data) => {
      console.log(data);
    });
    this.toastr.success(
      this.language.inviteFriendsForEventSuccessSendText,
      "",
      {
        timeOut: 7000,
        positionClass: "toast-bottom-right",
      }
    );
    this.inviteFriendWindow = false;
  }

  sendInviteForSelectedVirtualParticipant(type) {
    let customMessage = {};
    if (type === 'speakers') {
      customMessage = {
        subject: this.language.inviteVirtualParticipantSpeakerForEventSubject,
        message: this.language.inviteVirtualParticipantSpeakerForEventMessage
      };
    } else {
      customMessage = {
        subject: this.language.inviteVirtualParticipantListenerForEventSubject,
        message: this.language.inviteVirtualParticipantlistenerForEventMessage
      }
    }
    const data = {
      inviter_id: localStorage.getItem("id"),
      inviter_fullname: JSON.parse(localStorage.getItem("user"))["fullname"],
      event_id: this.id,
      friends: this.packSelectedMemberToList(type === 'speakers' ? this.selectedSpeakers : this.selectedListeners),
      language: this.packLanguageForVirtualParticipant(customMessage),
    };

    if (data.friends) {
      this.service.sendInviteToVirtualParticipantForEvent(data).subscribe((data) => {
        console.log(data);
      });
      this.toastr.success(
        this.language.inviteFriendsForEventSuccessSendText,
        "",
        {
          timeOut: 7000,
          positionClass: "toast-bottom-right",
        }
      );

      if (this.isInAList(type, type === 'speakers' ? this.selectedSpeakers : this.selectedListeners)) {
        const data = {
          id: this.id,
          type: type,
          participant: type === 'speakers' ? this.selectedSpeakers : this.selectedListeners
        };

        this.editEventService.pushNewParticipant(data).subscribe(
          data => {
            console.log(data);
          }
        );
      }

    } else {
      this.helpService.createErrorMessage();
    }
    this.inviteFriendWindow = false;
  }

  isInAList(type, participant) {
    if (type === 'speakers') {
      for (let i = 0; i < this.data.speakers.length; i++) {
        if (this.data.speakers[i].id === participant.id) {
          return false;
        }
      }
    } else {
      for (let i = 0; i < this.data.listeners.length; i++) {
        if (this.data.listeners[i].id === participant.id) {
          return false;
        }
      }
    }

    return true;
  }

  packLanguageForInvite() {
    return {
      inviteFriendsForEventRegardsFirst: this.language
        .inviteFriendsForEventRegardsFirst,
      inviteFriendsForEventMessage: this.language.inviteFriendsForEventMessage,
      inviteFriendsForEventShowEventDetails: this.language
        .inviteFriendsForEventShowEventDetails,
      inviteFriendsForEventThanksForUsing: this.language
        .inviteFriendsForEventThanksForUsing,
      inviteFriendsForEventHaveQuestion: this.language
        .inviteFriendsForEventHaveQuestion,
      inviteFriendsForEventGenerateMail: this.language
        .inviteFriendsForEventGenerateMail,
      inviteFriendsForEventCopyright: this.language
        .inviteFriendsForEventCopyright,
      inviteFriendsForEventSubject: this.language.inviteFriendsForEventSubject,
      inviteFriendsForEventInviteSend: this.language
        .inviteFriendsForEventInviteSend,
    };
  }

  packLanguageForVirtualParticipant(customMessage) {
    return {
      inviteVirtualParticipantForEventRegardsFirst: this.language
        .inviteVirtualParticipantForEventRegardsFirst,
      inviteVirtualParticipantForEventMessage: customMessage.message,
      inviteVirtualParticipantForEventShowEventDetails: this.language
        .inviteVirtualParticipantForEventShowEventDetails,
      inviteVirtualParticipantForEventThanksForUsing: this.language
        .inviteVirtualParticipantForEventThanksForUsing,
      inviteVirtualParticipantForEventHaveQuestion: this.language
        .inviteVirtualParticipantForEventHaveQuestion,
      inviteVirtualParticipantForEventGenerateMail: this.language
        .inviteVirtualParticipantForEventGenerateMail,
      inviteVirtualParticipantForEventCopyright: this.language
        .inviteVirtualParticipantForEventCopyright,
      inviteVirtualParticipantForEventSubject: customMessage.subject,
      inviteVirtualParticipantForEventInviteSend: this.language
        .inviteVirtualParticipantForEventInviteSend,
    };
  }

  sendReminderForSelectedFriends() {
    const data = {
      inviter_id: localStorage.getItem("id"),
      reminder_fullname: JSON.parse(localStorage.getItem("user"))["fullname"],
      event_id: this.id,
      friends: this.packSelectedMemberToList(this.selectedReminderFriends),
      language: this.packLanguageForReminder(),
    };

    this.service.sendReminderForEvent(data).subscribe((data) => {
      console.log(data);
    });
    this.toastr.success(
      this.language.reminderFriendsForEventSuccessSendText,
      "",
      {
        timeOut: 7000,
        positionClass: "toast-bottom-right",
      }
    );
    this.reminderFriendsWindow = false;
  }

  packLanguageForReminder() {
    return {
      reminderFriendsForEventRegardsFirst: this.language
        .reminderFriendsForEventRegardsFirst,
      reminderFriendsForEventMessage: this.language
        .reminderFriendsForEventMessage,
      reminderFriendsForEventShowEventDetails: this.language
        .reminderFriendsForEventShowEventDetails,
      reminderFriendsForEventThanksForUsing: this.language
        .reminderFriendsForEventThanksForUsing,
      reminderFriendsForEventHaveQuestion: this.language
        .reminderFriendsForEventHaveQuestion,
      reminderFriendsForEventGenerateMail: this.language
        .reminderFriendsForEventGenerateMail,
      reminderFriendsForEventCopyright: this.language
        .reminderFriendsForEventCopyright,
      reminderFriendsForEventSubject: this.language
        .reminderFriendsForEventSubject,
      reminderFriendsForEventSend: this.language.reminderFriendsForEventSend,
    };
  }

  packSelectedMemberToList(data) {
    let list = [];
    for (let i = 0; i < data.length; i++) {
      const item = {
        fullname: data[i].fullname,
        email: data[i].email,
      };
      list.push(item);
    }
    return list;
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

  isSelectedAllFriends() {
    if (
      this.selectedInviteFriends &&
      this.currentLoadData &&
      this.selectedInviteFriends.length !== this.currentLoadData.length
    ) {
      return false;
    } else {
      return true;
    }
  }

  isSelectedAllReminderFriends() {
    if (
      this.selectedReminderFriends &&
      this.currentLoadData &&
      this.selectedReminderFriends.length !== this.currentLoadData.length
    ) {
      return false;
    } else {
      return true;
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

  checkVirtualParticipant(data) {
    for (let i = 0; i < data.speakers.length; i++) {
      if (sha1(data.speakers[i].id.toString()) === localStorage.getItem("id")) {
        this.registerLikeSpeaker = 1;
        break;
      }
    }
    if (this.registerLikeSpeaker !== 1) {
      for (let i = 0; i < data.speakersConfirm.length; i++) {
        if (sha1(data.speakersConfirm[i].id.toString()) === localStorage.getItem("id")) {
          this.registerLikeSpeaker = 2;
          break;
        }
      }
      if (this.registerLikeSpeaker !== 1 && this.registerLikeSpeaker !== 2) {
        for (let i = 0; i < data.listeners.length; i++) {
          if (sha1(data.listeners[i].id.toString()) === localStorage.getItem("id")) {
            this.registerLikeListener = 1;
            break;
          }
        }
        if (this.registerLikeListener !== 1) {
          for (let i = 0; i < data.listenersConfirm.length; i++) {
            if (sha1(data.listenersConfirm[i].id.toString()) === localStorage.getItem("id")) {
              this.registerLikeListener = 2;
              break;
            }
          }
        }
      }
    }
  }

  signInVirtualParticipant(type) {
    this.profileService.getUserInfoSHA1(localStorage.getItem("id")).subscribe((user) => {
      const data = {
        id: this.id,
        type: type,
        participant: user[0]
      };
      this.editEventService.signInVirtualParticipant(data).subscribe(
        data => {
          if (data) {
            this.helpService.updateSuccessMessage();
          } else {
            this.helpService.updateErrorMessage();
          }
        }
      )
    });
  }
}
