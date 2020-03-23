import { Component, OnInit, ViewChild } from '@angular/core';
import { Modal } from 'ngx-modal';

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
    /*this.selectedNodeModel[this.selectedNode] = "";
    this.selectedNode = node;
    this.selectedNodeModel[this.selectedNode] = "active";
    setTimeout(() => {
      this.pathFromUrl = window.location.pathname.split("/");
      console.log(this.pathFromUrl);
    }, 10);*/
  }
}
