import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LifeEventService } from "src/app/services/life-event.service";
import { ProfileService } from "src/app/services/profile.service";
import { ConnectionService } from "src/app/services/connection.service";
import { ToastrService } from "ngx-toastr";
import * as sha1 from "sha1";
import { HelpService } from "src/app/services/help.service";
import { EditEventService } from "src/app/services/edit-event.service";

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: LifeEventService,
    private profileService: ProfileService,
    private connectionService: ConnectionService,
    private toastr: ToastrService,
    private helpService: HelpService,
    private editEventService: EditEventService
  ) {}

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
        this.owner = this.checkEventStatusForUser(this.data.id_user);
        this.getOrganizatorProfile(data["id_user"]);
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
    this.router.navigate(["home/main/event/edit-event/virtual/" + this.data._id]);
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
    const data = {
      inviter_id: localStorage.getItem("id"),
      inviter_fullname: JSON.parse(localStorage.getItem("user"))["fullname"],
      event_id: this.id,
      friends: this.packFriendList(this.selectedInviteFriends),
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

  sendReminderForSelectedFriends() {
    const data = {
      inviter_id: localStorage.getItem("id"),
      reminder_fullname: JSON.parse(localStorage.getItem("user"))["fullname"],
      event_id: this.id,
      friends: this.packFriendList(this.selectedReminderFriends),
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

  packFriendList(data) {
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

  openProfile(id) {
    this.router.navigate(["/home/main/profile/" + sha1(id.toString())]);
  }

  goToRoom() {
    this.router.navigate(["/home/main/room/" + this.id]);
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
}