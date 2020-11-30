import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ConnectionService } from "src/app/services/connection.service";
import { EditEventService } from "src/app/services/edit-event.service";
import { ProfileService } from "src/app/services/profile.service";
import * as sha1 from "sha1";
import { HelpService } from "src/app/services/help.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-virtual",
  templateUrl: "./virtual.component.html",
  styleUrls: ["./virtual.component.scss"],
})
export class VirtualComponent implements OnInit {
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

  public allMyConnectionSpeakers: any;
  public allMyConnectionListeners: any;
  public currentLoadData: any;
  public showPreview = false;
  public organizer: any;

  constructor(
    private connectionService: ConnectionService,
    private editEventService: EditEventService,
    private profile: ProfileService,
    private helpService: HelpService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initialization();
  }

  initialization() {
    this.data.speakers = [];
    this.data.listeners = [];
    this.getInitialData();
    this.getAllMyConnection();
  }

  getInitialData() {
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
            "/home/main/event/virtual-event-details/" + this.data._id,
          ]);
        } else {
          this.helpService.updateErrorMessage();
        }
      });
    } else {
      if (Number.isInteger(this.data.id_user)) {
        this.data.id_user = sha1(this.data.id_user.toString());
      }
      this.data.eventType = 2;
      this.data.signIn = [];
      this.editEventService.createEventData(this.data).subscribe((data) => {
        console.log(data);
        if (data["create"]) {
          this.helpService.createSuccessMessage();
          this.router.navigate(["/home/main/event/all"]);
        } else {
          this.helpService.createErrorMessage();
        }
      });
    }
  }

  addOrganizatorToSpeakers(event) {
    this.data.speakers.push(event);
  }

  removeOrganizatorFromSpeakers(id_user) {
    let index = -1;
    for (let i = 0; i < this.data.speakers.length; i++) {
      if ((sha1(this.data.speakers[i].id.toString()) === id_user) || (this.data.speakers[i].id === id_user)) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      this.data.speakers.splice(index, 1);
    }
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

  speakersChange(event) {
    console.log(event);
    this.data.speakers = event;
  }

  isItemSelectedListeners(itemText: string): boolean {
    return this.data.listeners.some((item) => item.id === itemText);
  }

  convertToNeededType() {
    this.data.date = new Date(this.data.date);
    this.data.time = new Date(this.data.time);
  }

  searchOrganizator(event) {
    this.searchOrganizatorEmitter.emit(event);
  }

  selectOrganizator(event) {
    this.removeOrganizatorFromSpeakers(this.data.id_user);
    if (event) {
      this.organizer = event;
      this.data.organizer = event.fullname;
      this.addOrganizatorToSpeakers(event);
    }
  }

  selectEvent(event) {
    this.selectEventEmitter.emit(event);
  }

  selectAllForSpeakers() {
    if (this.data.speakers.length !== this.currentLoadData.length) {
      this.data.speakers = this.currentLoadData;
    } else {
      this.data.speakers = [];
    }
  }

  selectAllForListeners() {
    if (this.data.listeners.length !== this.currentLoadData.length) {
      this.data.listeners = this.currentLoadData;
    } else {
      this.data.listeners = [];
    }
  }
}
