import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  EventEmitter,
  Output,
} from "@angular/core";
import * as RecordRTC from "recordrtc";
import { WebcamUtil } from "ngx-webcam";

@Component({
  selector: "app-record-video",
  templateUrl: "./record-video.component.html",
  styleUrls: ["./record-video.component.scss"],
})
export class RecordVideoComponent implements OnInit {
  @Input() width: any;
  @Input() height: any;
  @Output() saveRecordVideoEmitter = new EventEmitter<any>();

  public disabled: any;
  public recording = false;
  public recorder: any;
  public multipleWebcamsAvailable = false;
  public previewVideo = true;
  public language: any;
  @ViewChild("videoPreview")
  video: ElementRef<HTMLVideoElement>;

  constructor() {
    /*console.log(document.getElementById("video-preview"));
    console.log(document.querySelector('video'));
    this.video = document.getElementById("video-preview");*/
  }

  ngOnInit() {
    this.language = JSON.parse(localStorage.getItem("language"));
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
    this.width = this.width - 100;
    this.height = this.height - 140;
  }

  startRecording() {
    this.disabled = true;
    this.previewVideo = false;
    this.recording = !this.recording;
    this.captureCamera((camera) => {
      this.video.nativeElement.muted = true;
      this.video.nativeElement.volume = 0;
      this.video.nativeElement.srcObject = camera;
      this.video.nativeElement.style.width = this.width.toString() + "px";
      this.video.nativeElement.style.height = this.height.toString() + "px";

      this.recorder = RecordRTC(camera, {
        type: "video",
      });

      this.recorder.startRecording();

      // release camera on stopRecording
      this.recorder.camera = camera;
    });
  }

  stopRecording() {
    this.disabled = true;
    this.recorder.stopRecording(() => {
      this.stopRecordingCallback();
    });
  }

  captureCamera(callback) {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(function (camera) {
        callback(camera);
      })
      .catch(function (error) {
        alert("Unable to capture your camera. Please check console logs.");
        console.error(error);
      });
  }

  /*captureCamera() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: {
        width: this.width - 100,
        height: this.height - 140,
    } })
      .then((stream) => {
        console.log(this.video);
        this.video.nativeElement.muted = true;
        this.video.nativeElement.volume = 0;
        this.video.nativeElement.srcObject = stream;

        this.recorder = RecordRTC(stream, {
          type: "video",
        });

        this.recorder.startRecording();

        // release camera on stopRecording
        this.recorder.camera = stream;
      })
      .catch(function (error) {
        alert("Unable to capture your camera. Please check console logs.");
        console.error(error);
      });
  }*/

  stopRecordingCallback() {
    this.video.nativeElement.src = null;
    this.video.nativeElement.srcObject = null;
    this.video.nativeElement.muted = false;
    this.video.nativeElement.volume = 1;
    this.video.nativeElement.src = window.URL.createObjectURL(
      this.recorder.getBlob()
    );

    this.recording = !this.recording;

    /*this.recorder.camera.stop();
    this.recorder.destroy();
    this.recorder = null;*/
  }

  saveRecordVideo() {
    let video = this.recorder.getBlob();
    video["name"] = "Recording video";
    this.recorder.camera.stop();
    this.recorder.destroy();
    this.recorder = null;
    this.saveRecordVideoEmitter.emit(video);
  }

  createNew() {
    this.video = null;
    this.previewVideo = true;
    this.recording = false;
  }
}
