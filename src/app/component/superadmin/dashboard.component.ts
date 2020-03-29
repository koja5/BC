import { Component, OnInit, ViewChild } from '@angular/core';
import { Modal } from 'ngx-modal';
declare var document: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild("settings") settings: Modal;
  public sidebar = "";
  public sidebarMobile = "";
  public profile = "";
  public imagePath: any = "../../../assets/img/users/defaultUser.png";
  
  constructor() { }

  ngOnInit() {
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

  returnActiveNode(node) {
  }

  toggleFullscreen(): void {
    const isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
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
}
