import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { WebcamInitError, WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { RecommendationModel } from 'src/app/models/recommendation-model';
import { HelpService } from 'src/app/services/help.service';
import { MessageService } from 'src/app/services/message.service';
import { ProfileService } from 'src/app/services/profile.service';
import * as sha1 from "sha1";

@Component({
  selector: 'app-take-camera-dialog',
  templateUrl: './take-camera-dialog.component.html',
  styleUrls: ['./take-camera-dialog.component.scss']
})
export class TakeCameraDialogComponent implements OnInit, AfterViewInit {

  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  @Input() show: boolean;

  // @Input() width: any;
  // @Input() height: any;

  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public height = 440;
  public width = 595;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  public errors: WebcamInitError[] = [];
  public webcamImage: WebcamImage = null;
  public language: any;
  public croppedImage: any = "";
  public data: any;
  public imageChangedEvent: any = "";
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
  public heightContainer: any;
  public recommendedItem: any;
  public recommendedWindow = false;
  public recommendationStatus = new RecommendationModel();
  public promoWindow = false;
  public maxFileImageSize = 1 * 1024 * 1024;
  public maxFileCoverSize = 1 * 1024 * 1024;
  public uploadProfileWindow = false;
  public id: any;

  constructor(private helpService: HelpService,
    private messageService: MessageService,
    private profileService: ProfileService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    const routeElem = this.router.url.split('/');
    this.id = routeElem[routeElem.length - 1];
    this.language = this.helpService.getLanguage();
    this.user = JSON.parse(localStorage.getItem("user"));

    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
    this.videoOptions = {
      width: this.width,
      height: this.height,
    };
  }

  ngAfterViewInit(): void {
    this.initialization();
  }

  public initialization(): void {
    this.profileService.getUserInfoSHA1(this.id).subscribe((data) => {
      this.data = data[0];
      if (
        sha1(data[0].id.toString()) === localStorage.getItem("id") ||
        this.user.type === sha1(0)
      ) {
        this.owner = true;
      }
    });

    this.uploader = new FileUploader({
      url: this.url,
      maxFileSize: 1 * 1024 * 1024,
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
      if (respon["info"]) {
        if (respon["type"] === "img") {
          this.data.image = respon["name"];
        } else {
          this.data.cover = respon["name"];
        }
      }
      this.loadImage = false;
    };
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public takeANew(): void {
    this.webcamImage = null;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info("received webcam image", webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log("active device: " + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  public saveImage(): void {
    this.modal.close();
    this.croppedImage = this.webcamImage["_imageAsDataUrl"];
    this.save();
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
    this.messageService.sendUserInfo();
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

}
