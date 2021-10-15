import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileItem, FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-record-camera-dialog',
  templateUrl: './record-camera-dialog.component.html',
  styleUrls: ['./record-camera-dialog.component.scss']
})
export class RecordCameraDialogComponent implements OnInit {
  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  @Input() width: any;
  @Input() height: any;
  @Input() id: any;

  public uploaderPromo: FileUploader;
  public url = "https://116.203.85.82:" + location.port + "/uploadPromo";
  public imageChangedEvent: any;
  public loadVideo = false;
  public maxFilePromoVideo = 50 * 1024 * 1024;
  public recordCameraPromoWindow = false;

  constructor() { }

  ngOnInit() {
  }

  saveRecordVideoEmitter(event) {
    this.imageChangedEvent = event;
    this.uploadVideo();
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
}
