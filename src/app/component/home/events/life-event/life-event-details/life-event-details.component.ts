import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LifeEventService } from "src/app/services/life-event.service";
import { ProfileService } from "src/app/services/profile.service";

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: LifeEventService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.language = JSON.parse(localStorage.getItem("language"));
    this.initialization();
    console.log(this.data);
  }

  initialization() {
    this.id = this.route.snapshot.params.id;
    if (this.id) {
      this.service.getLifeEvent(this.id).subscribe((data) => {
        this.data = data;
        this.checkEventStatusForUser({
          _id: this.data._id,
          id_user: localStorage.getItem("id"),
        });
        this.checkFreeSpace();
        this.getOrganizatorProfile(data["id_user"]);
      });
    }
  }

  checkEventStatusForUser(data) {
    this.service.checkEventStatusForUser(data).subscribe((data: boolean) => {
      this.eventStatus = data;
    });
  }

  editEvent() {
    this.router.navigate(["home/main/event/edit-event/" + this.data._id]);
  }

  deleteEvent(answer) {
    if (answer === "yes") {
      this.service.deleteEvent(this.data._id).subscribe((data) => {
        if (data) {
          // this.router.navigate(["/home/main/event/all"]);
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
}
