import { Component, OnInit, HostListener } from "@angular/core";
import { EventAllService } from "src/app/services/event-all.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

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
  public allData: any;
  public language: any;
  public eventShareShowHide = -1;
  public months: any;

  constructor(
    private service: EventAllService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.language = JSON.parse(localStorage.getItem("language"));
    this.months = this.language.months;
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
      this.data = this.allData.filter((x) => x.eventType === 1);
    } else if (type === "virtual") {
      this.data = this.allData.filter((x) => x.eventType === 2);
    }
  }

  getAllEvent() {
    this.service.getAllEvents(localStorage.getItem("id")).subscribe((data) => {
      this.data = data;
      this.allData = data;
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

  shareEvent(id) {
    if (this.eventShareShowHide === -1) {
      this.eventShareShowHide = id;
    } else {
      this.eventShareShowHide = -1;
    }
  }

  copyLinkToClipboard(id) {
    const link =
      window.location.protocol +
      "//" +
      window.location.hostname +
      ":" +
      window.location.port +
      "/home/main/event/life-event-details/" +
      id;
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = link;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
    this.toastr.success(this.language.feedCopiedLinkInClipboard, "", {
      timeOut: 7000,
      positionClass: "toast-bottom-right",
    });
    this.eventShareShowHide = -1;
  }

  getNumberOfMonth(data) {
    return new Date(data).getMonth();
  }
}
