import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { LifeEventService } from "src/app/services/life-event.service";
import { ProfileService } from "src/app/services/profile.service";
import * as sha1 from "sha1";
import { Router } from "@angular/router";
import { HelpService } from "src/app/services/help.service";
import { EditEventService } from "src/app/services/edit-event.service";
import { ConnectionService } from "src/app/services/connection.service";

@Component({
  selector: "app-life",
  templateUrl: "./life.component.html",
  styleUrls: ["./life.component.scss"],
})
export class LifeComponent implements OnInit {
  @Input() language: any;
  @Input() type: any;
  @Input() id: any;
  @Input() data: any;
  @Input() events: any;
  @Input() organizatorLoading: boolean;
  @Input() organizators: any;
  @Output() searchOrganizatorEmitter = new EventEmitter<any>();
  @Output() selectOrganizatorEmitter = new EventEmitter<any>();
  @Output() selectEventEmitter = new EventEmitter<any>();
  public showPreview = false;
  public allMyConnectionSpeakers: any;
  public allMyConnectionListeners: any;
  public currentLoadData: any;
  public showWhoConfirmInvite = false;

  constructor(
    private lifeEventService: LifeEventService,
    private router: Router,
    private profile: ProfileService,
    private helpService: HelpService,
    private editEventService: EditEventService,
    private connectionService: ConnectionService
  ) { }

  ngOnInit() {
    this.initialization();
  }

  initialization() {
    this.data.signIn = [];
    this.getAllMyConnection();

    if (this.id !== "create") {
      this.editEventService.getEventData(this.id).subscribe((data) => {
        this.profile.getUserInfoSHA1(data["id_user"]).subscribe((data) => {
          this.organizators = data;
          this.organizators[0].id = sha1(this.organizators[0].id.toString());
          this.data.organizer = this.organizators[0].fullname;
        });
        this.data = data;
        this.convertToNeededType();
      });
    } else {
      this.profile
        .getUserInfoSHA1(localStorage.getItem("id"))
        .subscribe((data) => {
          this.organizators = data;
          this.organizators[0].id = sha1(this.organizators[0].id.toString());
          this.data.organizer = this.organizators[0].fullname;
        });
    }
  }

  saveChanges() {
    if (this.id !== "create") {
      if (Number.isInteger(this.data.id_user)) {
        this.data.id_user = sha1(this.data.id_user.toString());
      }
      this.editEventService.updateEventData(this.data).subscribe((data) => {
        console.log(data);
        if (data) {
          this.helpService.updateSuccessMessage();
          this.router.navigate([
            "/home/main/event/life-event-details/" + this.id,
          ]);
        } else {
          this.helpService.updateErrorMessage();
        }
      });
    } else {
      if (Number.isInteger(this.data.id_user)) {
        this.data.id_user = sha1(this.data.id_user.toString());
      }
      this.data.eventType = 1;
      this.data.signIn = [];
      this.editEventService.createEventData(this.data).subscribe((data) => {
        console.log(data);
        if (data["create"]) {
          this.helpService.createSuccessMessage();
          this.router.navigate([
            "/home/main/event/life-event-details/" + data["id"],
          ]);
        } else {
          this.helpService.createErrorMessage();
        }
      });
    }
  }

  convertToNeededType() {
    this.data.date = new Date(this.data.date);
    this.data.time = new Date(this.data.time);
  }

  searchOrganizator(event) {
    this.searchOrganizatorEmitter.emit(event);
  }

  addOrganizatorToSpeakers(event) {
    this.data.speakers.push(event);
  }

  removeOrganizatorFromSpeakers(id_user) {
    let index = -1;
    for (let i = 0; i < this.data.speakers.length; i++) {
      if (
        sha1(this.data.speakers[i].id.toString()) === id_user ||
        this.data.speakers[i].id === id_user
      ) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      this.data.speakers.splice(index, 1);
    }
  }

  selectOrganizator(event) {
    // this.selectOrganizatorEmitter.emit(event);
    this.data.organizer = event.fullname;
    this.removeOrganizatorFromSpeakers(this.data.id_user);
    if (event) {
      this.data.organizer = event.fullname;
      this.addOrganizatorToSpeakers(event);
    }
  }

  selectEvent(event) {
    this.selectEventEmitter.emit(event);
  }

  getAllMyConnection() {
    this.connectionService
      .getAllMyConnections(localStorage.getItem("id"))
      .subscribe((data) => {
        this.allMyConnectionSpeakers = data;
        this.allMyConnectionListeners = data;
        this.currentLoadData = data;
      });
  }

  handleFilterSpeakers(value) {
    this.allMyConnectionSpeakers = this.currentLoadData.filter(
      (s) => s.fullname.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  handleFilterListeners(value) {
    this.allMyConnectionListeners = this.currentLoadData.filter(
      (s) => s.fullname.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  isItemSelectedSpeakers(itemText: string): boolean {
    return this.data.speakers.some((item) => item.id === itemText);
  }

  isItemSelectedListeners(itemText: string): boolean {
    return this.data.listeners.some((item) => item.id === itemText);
  }
}
