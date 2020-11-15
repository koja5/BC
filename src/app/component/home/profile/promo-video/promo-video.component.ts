import {
  Component,
  OnInit,
  HostListener,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { FileUploader, FileItem } from "ng2-file-upload";
import { ToastrService } from 'ngx-toastr';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: "app-promo-video",
  templateUrl: "./promo-video.component.html",
  styleUrls: ["./promo-video.component.scss"],
})
export class PromoVideoComponent implements OnInit {
  @Input() promoWindow: boolean;
  @Input() id: any;
  @Input() video: any;
  @Input() owner: any;
  @Output() promoWindowEmitter = new EventEmitter<null>();

  public windowHeight: any;
  public windowWidth: any;
  public language: any;
  public uploaderPromo: FileUploader;
  // public url = "http://localhost:3000/uploadPromo";
  public url = "https://116.203.85.82:" + location.port + "/uploadPromo";
  public imageChangedEvent: any;
  public loadVideo = false;
  public maxFilePromoVideo = 50 * 1024 * 1024;
  public recordCameraPromoWindow = false;

  constructor(private toastr: ToastrService, private helpService: HelpService) {}

  ngOnInit() {
    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }
    this.language = JSON.parse(localStorage.getItem("language"));

    this.uploaderPromo = new FileUploader({
      url: this.url,
    });

    this.uploaderPromo.onBuildItemForm = (fileItem: FileItem, form: any) => {
      const date: number = new Date().getTime();
      const file = new File([this.imageChangedEvent], "1.PNG", {
        type: "image/png",
        lastModified: date,
      });
      /*if (this.typeOfUpload === "img") {
        this.imageData = this.croppedImage;
      } else {
        this.imageCover = this.croppedImage;
      }*/
      fileItem = new FileItem(this.uploaderPromo, file, {});
      form.append("description", fileItem.file["description"]);
      form.append(
        "date",
        fileItem.file.lastModifiedDate !== undefined
          ? fileItem.file.lastModifiedDate
          : new Date()
      );
      form.append("customer_id", this.id);
    };
    this.uploaderPromo.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      console.log(JSON.parse(response));
      const respon = JSON.parse(response);
      if (respon["info"]) {
        this.video = respon["name"];
        this.helpService.createSuccessMessage();
      }
      this.loadVideo = false;
    };
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    } else {
      this.windowWidth = null;
      this.windowHeight = null;
    }
  }

  closeWindow() {
    this.promoWindowEmitter.emit();
    this.promoWindow = false;
  }

  fileChange(event: any): void {
    if (event.target.files[0].size <= this.maxFilePromoVideo) {
      this.imageChangedEvent = event.target.files[0];
      this.uploadVideo();
    } else {
      this.toastr.error(this.language.adminMaxFilePromoVideo, "", {
        timeOut: 7000,
        positionClass: "toast-bottom-right",
      });
    }
  }

  uploadVideo() {
    this.loadVideo = true;
    const date: number = new Date().getTime();
    // Put the blob into the fileBits array of the File constructor
    // const myFile = this.dataURItoBlob(this.imageChangedEvent);
    const myFile = this.imageChangedEvent;
    const file = new File([myFile], this.id.toString(), {
      type: "video/mp4",
      lastModified: date,
    });
    console.log(file);
    const fileItem = new FileItem(this.uploaderPromo, file, { itemAlias: "1" });
    console.log(fileItem);
    this.uploaderPromo.queue = [];
    this.uploaderPromo.queue.push(fileItem);
    fileItem.upload();
  }

  dataURItoBlob(dataURI) {
    var binary = atob(dataURI);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: "video/mp4",
    });
  }

  saveRecordVideoEmitter(event) {
    this.imageChangedEvent = event;
    this.uploadVideo()
  }
  
}
