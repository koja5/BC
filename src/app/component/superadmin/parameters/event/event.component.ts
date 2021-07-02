import { Component, OnInit, HostListener } from "@angular/core";
import { DashboardService } from "src/app/services/dashboard.service";
import { EventService } from "src/app/services/parameters/event.service";
import { EventModel } from "src/app/models/event-model";
import { HelpService } from "src/app/services/help.service";

@Component({
  selector: "app-event",
  templateUrl: "./event.component.html",
  styleUrls: ["./event.component.scss"],
})
export class EventComponent implements OnInit {
  public gridConfiguration: any;
  public data: any;
  public height: any;
  public create = new EventModel();

  constructor(
    private service: DashboardService,
    private eventService: EventService,
    private helpService: HelpService
  ) {}

  ngOnInit() {
    this.height = window.innerHeight - 81;
    this.height += "px";
    this.initialization();
  }

  initialization() {
    this.service.getGridConfiguration("event").subscribe((data) => {
      this.gridConfiguration = data;
    });

    this.getEvents();
  }

  getEvents() {
    this.eventService.getEvents().subscribe((data) => {
      this.data = data;
    });
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.height = window.innerHeight - 81;
    this.height += "px";
  }

  sendEventEmitter(event) {
    console.log(event);
    const data1 = {
      name: "test",
      duration: 1234,
      description: "123456777",
    };
    this.data.push(data1);
    if (event.operation === "add") {
      this.createEvent(event.data);
    } else if (event.operation === "edit") {
      this.updateEvent(event.data);
    }
  }

  createEvent(data) {
    this.eventService.createEvent(data).subscribe((data) => {
      this.data = undefined;
      this.getEvents();
    });
  }

  updateEvent(data) {
    this.eventService.updateEvent(data).subscribe((data) => {
      if (data) {
        this.helpService.updateSuccessMessage();
        this.data = undefined;
        this.getEvents();
      } else {
        this.helpService.updateErrorMessage();
      }
    });
  }
}
