import { Component, OnInit, HostListener } from "@angular/core";
import { LifeEventModel } from "src/app/models/life-event-model";
import { EventService } from "src/app/services/parameters/event.service";
import { LifeEventService } from "src/app/services/life-event.service";
import { Router, ActivatedRoute } from "@angular/router";

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

  constructor(
    private service: EventService,
    private lifeEventService: LifeEventService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.windowWidth = window.innerWidth - 80;
    this.windowHeight = window.innerHeight - 120;
    this.language = JSON.parse(localStorage.getItem("language"));

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
        this.data = data;
        this.convertToNeededType();
        // this.getEventsByName(this.data.event);
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
    } else {
      this.data.event = null;
    }
  }

  saveChanges() {
    if (this.id === "life") {
      this.data.id_user = localStorage.getItem("id");
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
}
