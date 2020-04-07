import { Component, OnInit } from "@angular/core";
import { ProfileService } from "src/app/services/profile.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
  public id: number;
  public data: any;

  constructor(
    private service: ProfileService,
    public route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.initialization();
  }

  initialization() {
    this.service.getUserInfoSHA1(this.id).subscribe(data => {
      console.log(data);
      this.data = data[0];
    });
  }
}
