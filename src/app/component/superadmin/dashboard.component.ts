import { Component, OnInit, ViewChild } from "@angular/core";
import { Modal } from "ngx-modal";
import { DashboardService } from "src/app/services/dashboard.service";
import { Router } from "@angular/router";
import { CookieService } from "ng2-cookies";
import { HelpService } from 'src/app/services/help.service';
declare var document: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  // @ViewChild("settings") settings: Modal;
  public sidebar = "";
  public sidebarMobile = "";
  public profile = "";
  public imagePath: any = "../../../assets/img/users/defaultUser.png";
  public language: any;
  public user: any;
  public subMenuInd = '';
  public sidebarHeight: any;

  constructor(
    private service: DashboardService,
    private router: Router,
    private cookie: CookieService,
    private helpService: HelpService
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.initialization();
  }

  initialization() {
    if (localStorage.getItem("language") !== null) {
      this.language = this.helpService.getLanguage();
    } else {
      this.service.getTranslationFromFS("english").subscribe(data => {
        console.log(data);
        this.helpService.setLanguage(data);
        this.helpService.setLanguageCode('en');
        this.language = data["login"];
      });
    }
  }

  hideShowSidebar() {
    if (this.sidebar === "") {
      this.sidebar = "sidemenu-closed";
    } else {
      this.sidebar = "";
    }
  }

  hideShowSidebarMobile() {
    this.sidebar = "";
    if (this.sidebarMobile === "") {
      this.sidebarMobile = "collapse show";
    } else {
      this.sidebarMobile = "";
    }
  }

  showHideProfile() {
    if (this.profile === "") {
      this.profile = "show";
    } else {
      this.profile = "";
    }
  }

  returnActiveNode(node) { }

  toggleFullscreen(): void {
    const isInFullScreen =
      (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement &&
        document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement &&
        document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null);

    const docElm = document.documentElement;
    if (!isInFullScreen) {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  logout() {
    this.cookie.delete("user", "/home/main");
    this.cookie.delete("user", "/");
    this.router.navigate(["login"]);
  }

  showHideSubMenu() {
    if (this.subMenuInd === '') {
      this.subMenuInd = 'active open'
      this.sidebarHeight = window.innerHeight - 40 + 'px';
    } else {
      this.subMenuInd = '';
      this.sidebarHeight = 'auto';
    }
  }
}
