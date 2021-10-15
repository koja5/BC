import { Component, OnInit, HostListener } from "@angular/core";
import { LifeEventModel } from "src/app/models/life-event-model";
import { EventService } from "src/app/services/parameters/event.service";
import { ActivatedRoute } from "@angular/router";
import * as sha1 from "sha1";
import { LifeEventService } from "src/app/services/life-event.service";
import { VirtualEventModel } from "src/app/models/virtual-event-model";
import { EditEventService } from "src/app/services/edit-event.service";
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: "app-edit-event",
  templateUrl: "./edit-event.component.html",
  styleUrls: ["./edit-event.component.scss"],
})
export class EditEventComponent implements OnInit {
  public language: any;
  public data: any;
  public showPreview = false;
  public windowHeight: any;
  public windowWidth: any;
  public events: any;
  public type: any;
  public id: any;
  public organizators: any;
  public organizatorLoading = false;

  constructor(
    private service: EventService,
    private route: ActivatedRoute,
    private lifeEventService: LifeEventService,
    private editEventService: EditEventService,
    private helpService: HelpService
  ) { }

  ngOnInit() {
    this.windowWidth = window.innerWidth - 80;
    this.windowHeight = window.innerHeight - 120;
    this.language = this.helpService.getLanguage();
    this.initialization();
  }

  initialization() {
    this.service.getEvents().subscribe((data) => {
      this.events = data;
    });

    this.type = this.route.snapshot.params.type;
    this.id = this.route.snapshot.params.id;
    this.data = this.generateModel(this.type);
    this.data.id_user = localStorage.getItem("id");
  }

  generateModel(type) {
    if (type === "life") {
      return new LifeEventModel();
    } else if (type === "virtual") {
      return new VirtualEventModel();
    }
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

  selectEvent(event) {
    console.log(event);
    if (event) {
      this.data.event = event.name;
      this.data.attendees = event.duration;
    } else {
      this.data.event = null;
    }
  }

  selectOrganizator(event) {
    if (event) {
      this.data.id_user = sha1(event.id.toString());
      this.data.organizer = event.fullname;
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
      this.editEventService
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
