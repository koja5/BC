import { Component, OnInit } from '@angular/core';
import { EditProfileService } from 'src/app/services/edit-profile.service';
import { CookieService } from 'ng2-cookies';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  public id: any;
  public data: any;

  constructor(private service: EditProfileService, private cookie: CookieService, private router: Router) { }

  ngOnInit() {
    this.id = localStorage.getItem("id");
    this.initialization();
  }

  initialization() {
    this.service.getUserInfoSHA1(this.id).subscribe(data => {
      console.log(data);
      this.data = data[0];
      this.data.birthday = new Date(data[0].birthday);
    });
  }

  logout() {
    this.cookie.delete("user", "/home/main");
    this.cookie.delete("user", "/");
    this.router.navigate(["login"]);
  }

}
