import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { WebcamImage, WebcamInitError, WebcamUtil } from "ngx-webcam";

@Component({
  selector: "app-take-camera",
  templateUrl: "./take-camera.component.html",
  styleUrls: ["./take-camera.component.scss"],
})
export class TakeCameraComponent implements OnInit {
  @Input() show: boolean;
  @Input() width: any;
  @Input() height: any;
  @Output() takeASnapshotEmitter = new EventEmitter<any>();

  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
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

  constructor() {}

  ngOnInit() {
    this.language = JSON.parse(localStorage.getItem("language"));
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

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public saveImage(): void {
    this.takeASnapshotEmitter.emit(this.webcamImage);
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

}
