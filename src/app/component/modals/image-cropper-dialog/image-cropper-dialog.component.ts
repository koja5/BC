import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-image-cropper-dialog',
  templateUrl: './image-cropper-dialog.component.html',
  styleUrls: ['./image-cropper-dialog.component.scss']
})
export class ImageCropperDialogComponent implements OnInit {

  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  @Input() showCropper: boolean;
  public croppedImage: any = "";
  public imageChangedEvent: any = "";
  public language: any;


  constructor(private helpService: HelpService) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();
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

}
