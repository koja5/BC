import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordModel } from 'src/app/models/change-password-model';
import { HelpService } from 'src/app/services/help.service';
import * as sha1 from "sha1";
import { ToastrService } from 'ngx-toastr';
import { EditProfileService } from 'src/app/services/edit-profile.service';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {

  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;

  public language: any;
  public data: any;
  public id: any;

  public badOldPassword = false;
  public passwordIsNotEqual = false;
  public notUseSamePassword = false;
  public changePasswordData = new ChangePasswordModel();

  constructor(private helpService: HelpService,
    private editProfileService: EditProfileService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();
    this.id = localStorage.getItem("id");
    this.editProfileService.getUserInfoSHA1(this.id).subscribe((data) => {
      this.data = data[0];
      this.data.birthday = new Date(data[0].birthday);
    });

  }

  changePassword() {
    this.badOldPassword = false;
    this.passwordIsNotEqual = false;
    if (sha1(this.changePasswordData.old) !== this.data.password) {
      this.badOldPassword = true;
    } else if (
      this.changePasswordData.new !== this.changePasswordData.newRepeat
    ) {
      this.passwordIsNotEqual = true;
    } else if (this.data.password === sha1(this.changePasswordData.new)) {
      this.notUseSamePassword = true;
    } else {
      this.changePasswordData.id = this.data.id;
      this.editProfileService.updatePassword(this.changePasswordData).subscribe((data) => {
        if (data) {
          this.toastr.success(
            this.language.adminSuccessUpdateTitle,
            this.language.adminSuccessUpdateText,
            { timeOut: 7000, positionClass: "toast-bottom-right" }
          );
        } else {
          this.toastr.error(
            this.language.adminErrorUpdateTitle,
            this.language.adminErrorUpdateText,
            { timeOut: 7000, positionClass: "toast-bottom-right" }
          );
        }
        this.modal.close();
      });
    }
  }

}
