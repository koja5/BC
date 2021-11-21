import { RecommendedDialogComponent } from './../../modals/recommended-dialog/recommended-dialog.component';
import { PromoVideoComponent } from '../../modals/promo-video/promo-video.component';
import { Component, OnInit, HostListener } from "@angular/core";
import { ConnectionService } from "src/app/services/connection.service";
import { Router } from "@angular/router";
import * as sha1 from "sha1";
import { UserModel } from 'src/app/models/user-model';
import { HelpService } from 'src/app/services/help.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-connection",
  templateUrl: "./connection.component.html",
  styleUrls: ["./connection.component.scss"],
})
export class ConnectionComponent implements OnInit {
  public selectTab = "myConnection";
  public allUsers: any;
  public language: any;
  public searchTerm: any;
  public height: any;
  public hover = "fa fa-heart-o";
  public recommendedItem: any;
  public hoverItem: any;
  public selectedMember = new UserModel();

  constructor(
    private connectionService: ConnectionService,
    private router: Router,
    private modalService: NgbModal,
    private helpService: HelpService) { }

  ngOnInit() {
    if (window.innerWidth > 1000) {
      this.height = window.innerHeight - 104;
    } else {
      this.height = window.innerHeight - 121;
    }
    this.height += "px";
    this.language = this.helpService.getLanguage();
    this.initialization();
  }

  initialization() {
    this.getUsers(this.selectTab);
  }

  changeTab(tab) {
    this.selectTab = tab;
    this.getUsers(tab);
  }

  getUsers(tab) {
    this.allUsers = undefined;
    if (tab === "myConnection") {
      this.connectionService
        .getMyOwnConnection(localStorage.getItem("id"))
        .subscribe((data) => {
          console.log(data);
          this.allUsers = data;
        });
    } else {
      this.connectionService
        .getOtherConnections(localStorage.getItem("id"))
        .subscribe((data) => {
          console.log(data);
          this.allUsers = data;
        });
    }
  }

  openProfile(id) {
    console.log(id);
    this.router.navigate(["/home/main/profile/" + sha1(id.toString())]);
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    if (window.innerWidth > 1000) {
      this.height = window.innerHeight - 104;
    } else {
      this.height = window.innerHeight - 121;
    }
    this.height += "px";
  }

  heartHoverIn(index) {
    this.hover = "fa fa-heart";
    this.hoverItem = index;
  }

  heartHoverOut() {
    this.hover = "fa fa-heart-o";
    this.hoverItem = null;
  }

  recommended(id, name, email, phone) {
    this.recommendedItem = {
      id: id,
      name: name,
      email: email,
      phone: phone,
    };

    const modalRef = this.modalService.open(RecommendedDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.recommendedTitle + ' ' + name,
        text: () => null,
        imageUrl: () => null,
        imageStyle: () => null,
        primaryButtonLabel: () => null,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.email = email;
    modalRef.componentInstance.phone = phone;

    modalRef.result.catch(() => {
      this.recommendedItem = null;
    });
  }

  sendMessageForThisUser(data) {
    sessionStorage.setItem("message_user", JSON.stringify(data));
    this.router.navigate(["/home/main/message"]);
  }

  openPromoVideo(item) {
    this.selectedMember = item;

    const modalRef = this.modalService.open(PromoVideoComponent, {
      size: 'xl',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => null,
        text: () => null,
        imageUrl: () => null,
        imageStyle: () => null,
        primaryButtonLabel: () => null,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;
    modalRef.componentInstance.video = this.selectedMember.promo;
    modalRef.componentInstance.owner = false;
    modalRef.componentInstance.id = this.selectedMember.id;
  }
}
