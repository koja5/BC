import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import { ProfileService } from "src/app/services/profile.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FileUploader, FileItem } from "ng2-file-upload";
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from "@angular/platform-browser";
import { Dimensions, ImageCroppedEvent } from "ngx-image-cropper";
import { HelpService } from 'src/app/services/help.service';
import { MessageService } from 'src/app/services/message.service';
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  public id: number;
  public data: any;
  public language: any;
  public imageChangedEvent: any = "";
  public croppedImage: any = "";
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  public changeImage = false;
  public changeImageCover = false;
  public uploader: FileUploader;
  public imageBlob: Blob;
  public imageData: any;
  public imageCover: any;
  public loadImage = false;
  public typeOfUpload: any;
  public windowHeight: any;
  public windowWidth: any;
  // public url = "http://localhost:3000/upload";
  public url = "http://78.47.206.131:" + location.port + "/upload";

  constructor(
    private service: ProfileService,
    public route: ActivatedRoute,
    private message: MessageService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public helpService: HelpService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.language = JSON.parse(localStorage.getItem("language"));
    this.initialization();

    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }
  }

  initialization() {
    this.service.getUserInfoSHA1(this.id).subscribe((data) => {
      console.log(data);
      this.data = data[0];
      // this.imageData = this.helpService.getImage(this.data.img);
      // this.imageCover = this.helpService.getImage(this.data.cover);
    });

    this.uploader = new FileUploader({
      url: this.url,
    });

    this.uploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
      console.log(fileItem);
      const date: number = new Date().getTime();
      const file = new File([this.croppedImage], "1.PNG", {
        type: "image/png",
        lastModified: date,
      });
      if (this.typeOfUpload === "img") {
        this.imageData = this.croppedImage;
      } else {
        this.imageCover = this.croppedImage;
      }
      fileItem = new FileItem(this.uploader, file, {});
      console.log(fileItem);
      form.append("description", fileItem.file["description"]);
      form.append(
        "date",
        fileItem.file.lastModifiedDate !== undefined
          ? fileItem.file.lastModifiedDate
          : new Date()
      );
      form.append("customer_id", this.data.id);
    };
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      console.log(JSON.parse(response));
      const respon = JSON.parse(response);
      if(respon['info']) {
        if(respon["type"] === "img") {
        this.data.image = respon["name"];
        } else {
          this.data.cover = respon["name"];
        }
      }
      this.loadImage = false;
    };
  }

  fileChangeEventProfile(event: any): void {
    this.imageChangedEvent = event;
    this.changeImage = true;
    this.showCropper = true;
    this.typeOfUpload = "img";
  }

  fileChangeEventCover(event: any): void {
    this.imageChangedEvent = event;
    this.changeImageCover = true;
    this.showCropper = true;
    this.typeOfUpload = "cover";
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
    this.showCropper = false;
  }
  cropperReady() {
    /*this.service.uploadImage(this.croppedImage).subscribe((data) => {
      console.log(data);
    });*/
  }
  loadImageFailed() {
    // show message
  }

  public save() {
    this.loadImage = true;
    const date: number = new Date().getTime();
    // Put the blob into the fileBits array of the File constructor
    const myFile = this.dataURItoBlob(this.croppedImage);
    const file = new File(
      [myFile],
      this.id.toString() + "-" + this.typeOfUpload,
      {
        type: "image/png",
        lastModified: date,
      }
    );
    console.log(file);
    const fileItem = new FileItem(this.uploader, file, { itemAlias: "1" });
    console.log(fileItem);
    this.uploader.queue = [];
    this.uploader.queue.push(fileItem);
    fileItem.upload();
    this.changeImage = false;
    this.changeImageCover = false;
    this.message.sendUserInfo();
  }

  dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(",")[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: "image/jpg",
    });
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }
  }
}
