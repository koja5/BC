import { Component, OnInit, HostListener } from "@angular/core";
import { LifeEventModel } from "src/app/models/life-event-model";
import { EventService } from "src/app/services/parameters/event.service";
import { LifeEventService } from "src/app/services/life-event.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ProfileService } from "src/app/services/profile.service";
import * as sha1 from "sha1";

@Component({
  selector: "app-edit-event",
  templateUrl: "./edit-event.component.html",
  styleUrls: ["./edit-event.component.scss"],
})
export class EditEventComponent implements OnInit {
  public language: any;
  public data = new LifeEventModel();
  public showPreview = false;
  public windowHeight: any;
  public windowWidth: any;
  public events: any;
  public id: any;
  public organizators: any;
  public organizatorLoading = false;

  constructor(
    private service: EventService,
    private lifeEventService: LifeEventService,
    private router: Router,
    private route: ActivatedRoute,
    private profile: ProfileService
  ) {}

  ngOnInit() {
    this.windowWidth = window.innerWidth - 80;
    this.windowHeight = window.innerHeight - 120;
    this.language = JSON.parse(localStorage.getItem("language"));
    this.data.id_user = localStorage.getItem("id");
    this.initialization();
  }

  initialization() {
    this.service.getEvents().subscribe((data) => {
      this.events = data;
    });

    this.id = this.route.snapshot.params.type;
    this.data.signIn = [];
    if (this.id !== "life") {
      this.lifeEventService.getLifeEvent(this.id).subscribe((data) => {
        this.profile.getUserInfoSHA1(data["id_user"]).subscribe((data) => {
          this.organizators = data;
          this.organizators[0].id = sha1(this.organizators[0].id.toString());
        });
        this.data = data;
        this.convertToNeededType();
        // this.getEventsByName(this.data.event);
      });
    } else {
      this.profile
        .getUserInfoSHA1(localStorage.getItem("id"))
        .subscribe((data) => {
          this.organizators = data;
          this.organizators[0].id = sha1(this.organizators[0].id.toString());
        });
    }
  }

  convertToNeededType() {
    this.data.date = new Date(this.data.date);
    this.data.time = new Date(this.data.time);
  }

  getEventsByName(name) {
    this.service.getEventByName(name).subscribe((data) => {
      this.data.event = data[0];
    });
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    } else {
      this.windowWidth = null;
      this.windowHeight = null;
    }
  }

  selectedEvent(event) {
    console.log(event);
    if (event) {
      this.data.event = event.name;
      this.data.attendees = event.duration;
    } else {
      this.data.event = null;
    }
  }

  saveChanges() {
    if (this.id === "life") {
      if (Number.isInteger(this.data.id_user)) {
        this.data.id_user = sha1(this.data.id_user.toString());
      }
      this.data.eventType = 1;
      this.data.signIn = [];
      this.lifeEventService.createLifeEvent(this.data).subscribe((data) => {
        console.log(data);
        if (data["create"]) {
          this.router.navigate([
            "/home/main/event/life-event-details/" + data["id"],
          ]);
        }
      });
    } else {
      if (Number.isInteger(this.data.id_user)) {
        this.data.id_user = sha1(this.data.id_user.toString());
      }
      this.lifeEventService.updateEvents(this.data).subscribe((data) => {
        console.log(data);
        if (data) {
          this.router.navigate([
            "/home/main/event/life-event-details/" + this.id,
          ]);
        }
      });
    }
  }

  selectOrganizator(event) {
    if (event) {
      this.data.id_user = sha1(event.id.toString());
    } else {
      this.data.id_user = null;
    }
  }

  searchOrganizator(event) {
    if (event !== "" && event.length > 2) {
      this.organizatorLoading = true;
      const searchFilter = {
        filter: event,
      };
      this.lifeEventService
        .searchOrganizator(searchFilter)
        .subscribe((val: []) => {
          this.organizators = val.sort((a, b) =>
            String(a["fullname"]).localeCompare(String(b["fullname"]))
          );
          this.organizatorLoading = false;
        });
    } else {
      this.organizators = [];
    }
  }
}
