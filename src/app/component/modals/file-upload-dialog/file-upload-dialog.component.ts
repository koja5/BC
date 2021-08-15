import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HelpService } from 'src/app/services/help.service';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { ImageCropperDialogComponent } from '../image-cropper-dialog/image-cropper-dialog.component';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss']
})
export class FileUploadDialogComponent implements OnInit {
  public language: any;

  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  public uploader: FileUploader;

  constructor(
    public helpService: HelpService,
    private toastr: ToastrService,
    private modalService: NgbModal,

  ) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();
  }

  public openCameraDialog(): void {
    this.modal.dismiss('open-camera-dialog');
  }
  public maxFileImageSize = 1 * 1024 * 1024;
  public maxFileCoverSize = 1 * 1024 * 1024;
  fileChangeEventProfile(event: any): void {
    if (event.target.files[0].size <= this.maxFileImageSize) {
      this.showPopupForCroppingImage();

    } else {
      this.toastr.error(this.language.adminMaxFileImage, "", {
        timeOut: 7000,
        positionClass: "toast-bottom-right",
      });
    }
  }

  fileChangeEventCover(event: any): void {
    if (event.target.files[0].size <= this.maxFileCoverSize) {
      this.showPopupForCroppingImage();
    } else {
      this.toastr.error(this.language.adminMaxFileCover, "", {
        timeOut: 7000,
        positionClass: "toast-bottom-right",
      });
    }
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
