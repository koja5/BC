import { Component, OnInit, HostListener } from "@angular/core";
import { EventAllService } from "src/app/services/event-all.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.scss"],
})
export class EventsComponent implements OnInit {
  public windowWidth: any;
  public windowHeight: any;
  public createEventWindow = false;
  public myOrAllEvent = "all";
  public eventType = "all";
  public data: any;
  public language: any;

  constructor(private service: EventAllService, private router: Router) {}

  ngOnInit() {
    this.language = JSON.parse(localStorage.getItem("language"));
    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }
    this.initialization();
  }

  initialization() {
    this.getAllEvent();
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

  selectMyOrAllEventShow(type) {
    this.myOrAllEvent = type;
    if (type === "all") {
      this.getAllEvent();
    } else {
      this.getMyEvent();
    }
  }

  selectEventTypeShow(type) {
    this.eventType = type;

    if (type === "all") {
      this.getAllEvent();
    } else if (type === "life") {
      this.data = this.data.filter((x) => x.eventType === 1);
    }
  }

  getAllEvent() {
    this.service.getAllEvents(localStorage.getItem("id")).subscribe((data) => {
      this.data = data;
    });
  }

  getMyEvent() {
    this.service.getMyEvents(localStorage.getItem("id")).subscribe((data) => {
      this.data = data;
    });
  }

  getEventsByEventType(type) {
    this.service.getAllEventsByEventType(type).subscribe((data) => {
      this.data = data;
    });
  }

  openEvent(type, id) {
    if (type === 1) {
      this.router.navigate(["/home/main/event/life-event-details/" + id]);
    }
  }
}
