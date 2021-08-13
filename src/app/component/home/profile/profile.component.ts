import { ImageCropperDialogComponent } from './../../modals/image-cropper-dialog/image-cropper-dialog.component';
import { FileUploadDialogComponent } from './../../modals/file-upload-dialog/file-upload-dialog.component';
import {
  Component,
  OnInit,
  HostListener,
} from "@angular/core";
import { ProfileService } from "src/app/services/profile.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FileUploader, FileItem } from "ng2-file-upload";
import {
  DomSanitizer,
} from "@angular/platform-browser";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { HelpService } from "src/app/services/help.service";
import { MessageService } from "src/app/services/message.service";
import * as sha1 from "sha1";
import { EditProfileService } from "src/app/services/edit-profile.service";
import { RecommendationModel } from "src/app/models/recommendation-model";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TakeCameraDialogComponent } from '../../modals/take-camera-dialog/take-camera-dialog.component';

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  public id: number;
  public data: any;
  public language: any;

  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  public uploader: FileUploader;
  public imageBlob: Blob;
  public imageData: any;
  public imageCover: any;
  public loadImage = false;
  public typeOfUpload: any;
  public windowHeight: any;
  public windowWidth: any;
  public owner = false;
  // public url = "http://localhost:3000/upload";
  public url = "https://116.203.85.82:" + location.port + "/upload";
  public allExperience: any;
  public allEducation: any;
  public lookingOffer: any;
  public additionalInfo: any;
  public bankAccount: any;
  public selectedTab = "profile";
  public user: any;
  public height: any;
  public heightContainer: any;
  public recommendedItem: any;
  public recommendedWindow = false;
  public recommendationStatus = new RecommendationModel();
  public promoWindow = false;
  public maxFileImageSize = 1 * 1024 * 1024;
  public maxFileCoverSize = 1 * 1024 * 1024;
  public uploadProfileWindow = false;
  public takeACameraWindow = false;

  constructor(
    private service: ProfileService,
    public route: ActivatedRoute,
    private router: Router,
    private message: MessageService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public helpService: HelpService,
    public editProfileService: EditProfileService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.language = this.helpService.getLanguage();
    this.user = JSON.parse(localStorage.getItem("user"));
    this.initialization();

    if (window.innerWidth > 1000) {
      this.height = window.innerHeight - 104;
      this.heightContainer = this.height - 148;
    } else {
      this.height = window.innerHeight - 121;
      this.heightContainer = this.height - 148;
    }
    this.height += "px";
    this.heightContainer += "px";

    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }
  }

  initialization() {
    this.service.getUserInfoSHA1(this.id).subscribe((data) => {
      this.data = data[0];
      if (
        sha1(data[0].id.toString()) === localStorage.getItem("id") ||
        this.user.type === sha1(0)
      ) {
        this.owner = true;
      }
    });


    this.editProfileService.getExperience(this.id).subscribe((data: []) => {
      // this.allExperience = data;
      const currentDate = new Date().toString();
      this.allExperience = data.sort((a, b) => {
        return (
          <any>new Date(b["toDate"] ? b["toDate"] : "") -
          <any>new Date(a["toDate"])
        );
      });
    });

    this.editProfileService.getEducation(this.id).subscribe((data: []) => {
      // this.allEducation = data;
      this.allEducation = data.sort((a, b) => {
        return (
          <any>new Date(b["toDate"] ? b["toDate"] : "") -
          <any>new Date(a["toDate"])
        );
      });
    });

    this.editProfileService.getLookingOffer(this.id).subscribe((data) => {
      if (data["length"] > 0) {
        this.lookingOffer = data[0];
      }
    });

    this.editProfileService.getAdditionalInfo(this.id).subscribe((data) => {
      if (data["length"] > 0) {
        this.additionalInfo = data[0];
      }
    });

    this.editProfileService.getBankAccount(this.id).subscribe((data) => {
      if (data["length"] > 0) {
        this.bankAccount = data[0];
      }
    });

    this.service.getRecommendation(this.id).subscribe((data) => {
      for (let i = 0; i < data["length"]; i++) {
        if (data[i].status === 1) {
          this.recommendationStatus.helpfull = data[i].count;
        } else {
          this.recommendationStatus.notHelpfull = data[i].count;
        }
      }
    });
  }


  @HostListener("window:resize", ["$event"])
  onResize(event) {
    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }

    if (window.innerWidth > 1000) {
      this.height = window.innerHeight - 104;
      this.heightContainer = this.height - 148;
    } else {
      this.height = window.innerHeight - 121;
      this.heightContainer = this.height - 148;
    }
    this.height += "px";
    this.heightContainer += "px";
  }

  changeTab(tab) {
    this.selectedTab = tab;
  }

  recommended(id, name, email, phone) {
    this.recommendedItem = {
      id: id,
      name: name,
      email: email,
      phone: phone,
    };
    this.recommendedWindow = true;
  }

  recommendedWindowEmitter() {
    this.recommendedWindow = false;
    this.recommendedItem = null;
  }

  openPromoVideo() {
    this.promoWindow = true;
  }

  promoWindowEmitter() {
    this.promoWindow = false;
  }

  sendMessageForThisUser() {
    sessionStorage.setItem("message_user", JSON.stringify(this.data));
    this.router.navigate(["/home/main/message"]);
  }

  showPopupForChangeProfilePicture() {
    this.typeOfUpload = "img";

    const modalRef = this.modalService.open(FileUploadDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.profileUpdateProfileImage,
        text: () => null,
        imageUrl: () => './assets/img/upload_profile.png',
        imageStyle: () => 'width: 75%;',
        primaryButtonLabel: () => null,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;
    modalRef.componentInstance.id = this.id;

    modalRef.result.catch((reason) => {
      if (reason === 'open-camera-dialog') {
        this.modalService.dismissAll();
        this.openCameraDialog();
      }
    });
  }


  openCameraDialog(): void {
    const modalRef = this.modalService.open(TakeCameraDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.profileUpdateProfileImage,
        text: () => null,
        imageUrl: () => null,
        imageStyle: () => null,
        primaryButtonLabel: () => null,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;

    modalRef.result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(reason);
    });
  }

  showPopupForChangeCoverPicture() {
    this.typeOfUpload = "cover";

    const modalRef = this.modalService.open(FileUploadDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.profileUpdateCover,
        text: () => null,
        imageUrl: () => './assets/img/upload_profile.png',
        imageStyle: () => 'width: 75%;',
        primaryButtonLabel: () => null,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;
    modalRef.componentInstance.id = this.id;
  }


  public showPopupForCroppingImage(): void {
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ImageCropperDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.profileUpdateProfileImage,
        text: () => null,
        imageUrl: () => null,
        imageStyle: () => null,
        primaryButtonLabel: () => null,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;

    modalRef.result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(reason);
    });
  }
}
