import { Component, OnInit } from "@angular/core";
import { EditProfileService } from "src/app/services/edit-profile.service";
import { UserModel } from "src/app/models/user-model";
import { ToastrService } from "ngx-toastr";
import { MessageService } from "src/app/services/message.service";
import { ImageCroppedEvent } from "ngx-image-cropper";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"],
})
export class EditProfileComponent implements OnInit {
  public id: any;
  public data: any;
  imageChangedEvent: any = "";
  croppedImage: any = "";
  public language: any;

  constructor(
    private service: EditProfileService,
    private toastr: ToastrService,
    private message: MessageService
  ) {}

  ngOnInit() {
    this.id = localStorage.getItem("id");
    this.language = JSON.parse(localStorage.getItem("language"));
    this.initialization();
  }

  initialization() {
    this.service.getUserInfoSHA1(this.id).subscribe((data) => {
      console.log(data);
      this.data = data[0];
      this.data.birthday = new Date(data[0].birthday);
    });
  }

  saveChanges() {
    this.service.editUser(this.data).subscribe((data) => {
      console.log(data);
      if (data) {
        this.toastr.success(
          this.language.adminSuccessUpdateTitle,
          this.language.adminSuccessUpdateText,
          { timeOut: 7000, positionClass: "toast-top-right" }
        );
        const fullName = this.data.lastname + " " + this.data.firstname;
        let oldData = JSON.parse(localStorage.getItem("user"));
        oldData.fullname = fullName;
        localStorage.setItem("user", JSON.stringify(oldData));
        this.message.sendNewFullname();
      }
    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
}
