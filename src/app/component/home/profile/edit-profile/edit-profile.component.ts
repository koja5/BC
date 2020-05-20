import { Component, OnInit, HostListener } from "@angular/core";
import { EditProfileService } from "src/app/services/edit-profile.service";
import { UserModel } from "src/app/models/user-model";
import { ToastrService } from "ngx-toastr";
import { MessageService } from "src/app/services/message.service";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { ExperienceModel } from "src/app/models/experience-model";
import { EducationModel } from "src/app/models/education-model";
import { LookingOfferModel } from "src/app/models/looking-offer-model";
import { AdditionalInfoModel } from "src/app/models/additional-info-model";
import { BankAccountModel } from "src/app/models/bank-account-model";
import { ChangePasswordModel } from "src/app/models/change-password-model";
import * as sha1 from "sha1";
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"],
})
export class EditProfileComponent implements OnInit {
  public id: any;
  public data: any;
  public imageChangedEvent: any = "";
  public croppedImage: any = "";
  public language: any;
  public allExperience: any = [];
  public experience = new ExperienceModel();
  public experienceWindow = false;
  public windowWidth: any;
  public windowHeight: any;
  public modificationType: any;
  public selectedExperience: any;
  public deleteWindowExperience = false;
  public allEducation: any = [];
  public education = new EducationModel();
  public educationWindow = false;
  public selectedEducation: any;
  public deleteWindowEducation = false;
  public lookingOffer = new LookingOfferModel();
  public lookingOfferCreate = false;
  public additionalInfo = new AdditionalInfoModel();
  public additionalInfoCreate = false;
  public bankAccount = new BankAccountModel();
  public bankAccountCreate = false;
  public badIBAN = false;
  public salutationItem: any;
  public relationshipItem: any;
  public changePasswordWindow = false;
  public changePasswordData = new ChangePasswordModel();
  public badOldPassword = false;
  public passwordIsNotEqual = false;
  public notUseSamePassword = false;

  constructor(
    private service: EditProfileService,
    private toastr: ToastrService,
    private message: MessageService,
    public helpService: HelpService
  ) {}

  ngOnInit() {
    this.id = localStorage.getItem("id");
    this.language = JSON.parse(localStorage.getItem("language"));
    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }
    if (this.language.fieldSalutationItem !== undefined) {
      this.salutationItem = this.language.fieldSalutationItem;
    } else {
      this.salutationItem = [];
    }
    if (this.language.fieldRelationshipStatusItem !== undefined) {
      this.relationshipItem = this.language.fieldRelationshipStatusItem;
    } else {
      this.relationshipItem = [];
    }
    this.initialization();
  }

  initialization() {
    this.service.getUserInfoSHA1(this.id).subscribe((data) => {
      this.data = data[0];
      this.data.birthday = new Date(data[0].birthday);
    });

    this.getExperience();

    this.getEducation();

    this.service.getLookingOffer(this.id).subscribe((data) => {
      if (data["length"] > 0) {
        this.lookingOffer = data[0];
      } else {
        this.lookingOfferCreate = true;
      }
    });

    this.service.getAdditionalInfo(this.id).subscribe((data) => {
      if (data["length"] > 0) {
        this.additionalInfo = data[0];
      } else {
        this.additionalInfoCreate = true;
      }
    });

    this.service.getBankAccount(this.id).subscribe((data) => {
      if (data["length"] > 0) {
        this.bankAccount = data[0];
      } else {
        this.bankAccountCreate = true;
      }
    });
  }

  getExperience() {
    this.service.getExperience(this.id).subscribe((data: []) => {
      console.log(data);
      this.allExperience = data.sort((a, b) => {
        return (
          <any>new Date(b["toDate"] ? b["toDate"] : "") -
          <any>new Date(a["toDate"])
        );
      });
      for (let i = 0; i < this.allExperience.length; i++) {
        this.allExperience[i].toDate = this.convertStringToDate(
          this.allExperience[i].toDate
        );
        this.allExperience[i].fromDate = this.convertStringToDate(
          this.allExperience[i].fromDate
        );
      }
    });
  }

  getEducation() {
    this.service.getEducation(this.id).subscribe((data: []) => {
      console.log(data);
      this.allEducation = data.sort((a, b) => {
        return (
          <any>new Date(b["toDate"] ? b["toDate"] : "") -
          <any>new Date(a["toDate"])
        );
      });
      for (let i = 0; i < this.allEducation.length; i++) {
        this.allEducation[i].toDate = this.convertStringToDate(
          this.allEducation[i].toDate
        );
        this.allEducation[i].fromDate = this.convertStringToDate(
          this.allEducation[i].fromDate
        );
      }
    });
  }

  saveChanges() {
    this.service.editUser(this.data).subscribe((data) => {
      console.log(data);
      if (data) {
        this.toastr.success(
          this.language.adminSuccessUpdateTitle,
          this.language.adminSuccessUpdateText,
          { timeOut: 7000, positionClass: "toast-bottom-right" }
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

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }
  }

  saveExperience() {
    this.experience.id_user = this.id;
    this.service.createExperience(this.experience).subscribe((data) => {
      if (data["success"]) {
        this.toastr.success(
          this.language.adminSuccessCreateTitle,
          this.language.adminSuccessCreateText,
          { timeOut: 7000, positionClass: "toast-bottom-right" }
        );
        // this.allExperience.push(this.experience);
        this.experience = new ExperienceModel();
        this.getExperience();
        this.experienceWindow = false;
      } else {
        this.toastr.error(
          this.language.adminErrorCreateTitle,
          this.language.adminErrorCreateText,
          { timeOut: 7000, positionClass: "toast-bottom-right" }
        );
      }
    });
  }

  convertStringToDate(input) {
    if (input) {
      return new Date(input);
    } else {
      return null;
    }
  }

  editExperience(i) {
    this.experience = this.allExperience[i];
    this.selectedExperience = {
      index: i,
      data: this.allExperience[i],
    };
    this.modificationType = "edit";
    this.experienceWindow = true;
  }

  updateExperience() {
    this.service.updateExperience(this.experience).subscribe((data) => {
      if (data) {
        this.toastr.success(
          this.language.adminSuccessUpdateTitle,
          this.language.adminSuccessUpdateText,
          { timeOut: 7000, positionClass: "toast-bottom-right" }
        );
        this.experienceWindow = false;
        this.getExperience();
        this.experience = new ExperienceModel();
      } else {
        this.toastr.error(
          this.language.adminErrorUpdateTitle,
          this.language.adminErrorUpdateText,
          { timeOut: 7000, positionClass: "toast-bottom-right" }
        );
      }
    });
  }

  deleteExperience(answer) {
    if (answer === "yes") {
      this.service
        .deleteExperience(this.selectedExperience.data.id)
        .subscribe((data) => {
          if (data) {
            this.toastr.success(
              this.language.adminDeleteTitle,
              this.language.adminDeleteText,
              { timeOut: 7000, positionClass: "toast-bottom-right" }
            );
            this.allExperience.splice(this.selectedExperience.index, 1);
          }
        });
    }
    this.deleteWindowExperience = false;
    this.experienceWindow = false;
  }

  addNewExperience() {
    this.modificationType = "add";
    this.experienceWindow = true;
    this.experience = new ExperienceModel();
  }

  saveEducation() {
    this.education.id_user = this.id;
    this.service.createEducation(this.education).subscribe((data) => {
      if (data["success"]) {
        this.toastr.success(
          this.language.adminSuccessCreateTitle,
          this.language.adminSuccessCreateText,
          { timeOut: 7000, positionClass: "toast-bottom-right" }
        );
        // this.allEducation.push(this.education);
        this.education = new EducationModel();
        this.getEducation();
        this.educationWindow = false;
      } else {
        this.toastr.error(
          this.language.adminErrorCreateTitle,
          this.language.adminErrorCreateText,
          { timeOut: 7000, positionClass: "toast-bottom-right" }
        );
      }
    });
  }

  editEducation(i) {
    this.education = this.allEducation[i];
    this.selectedEducation = {
      index: i,
      data: this.allEducation[i],
    };
    this.modificationType = "edit";
    this.educationWindow = true;
  }

  updateEducation() {
    this.service.updateEducation(this.education).subscribe((data) => {
      if (data) {
        this.toastr.success(
          this.language.adminSuccessUpdateTitle,
          this.language.adminSuccessUpdateText,
          { timeOut: 7000, positionClass: "toast-bottom-right" }
        );
        this.educationWindow = false;
        this.getEducation();
        this.education = new EducationModel();
      } else {
        this.toastr.error(
          this.language.adminErrorUpdateTitle,
          this.language.adminErrorUpdateText,
          { timeOut: 7000, positionClass: "toast-bottom-right" }
        );
      }
    });
  }

  deleteEducation(answer) {
    if (answer === "yes") {
      this.service
        .deleteEducation(this.selectedEducation.data.id)
        .subscribe((data) => {
          if (data) {
            this.toastr.success(
              this.language.adminDeleteTitle,
              this.language.adminDeleteText,
              { timeOut: 7000, positionClass: "toast-bottom-right" }
            );
            this.allEducation.splice(this.selectedEducation.index, 1);
          }
        });
    }
    this.deleteWindowEducation = false;
    this.educationWindow = false;
  }

  addNewEducation() {
    this.modificationType = "add";
    this.educationWindow = true;
    this.education = new EducationModel();
  }

  saveLookingOffer() {
    if (!this.lookingOfferCreate) {
      this.service.updateLookingOffer(this.lookingOffer).subscribe((data) => {
        if (data) {
          this.toastr.success(
            this.language.adminSuccessUpdateTitle,
            this.language.adminSuccessUpdateText,
            { timeOut: 7000, positionClass: "toast-bottom-right" }
          );
          this.educationWindow = false;
          this.education = new EducationModel();
        } else {
          this.toastr.error(
            this.language.adminErrorUpdateTitle,
            this.language.adminErrorUpdateText,
            { timeOut: 7000, positionClass: "toast-bottom-right" }
          );
        }
      });
    } else {
      this.lookingOffer.id_user = this.id;
      this.service.createLookingOffer(this.lookingOffer).subscribe((data) => {
        if (data["success"]) {
          this.toastr.success(
            this.language.adminSuccessCreateTitle,
            this.language.adminSuccessCreateText,
            { timeOut: 7000, positionClass: "toast-bottom-right" }
          );
          this.allEducation.push(this.education);
          this.education = new EducationModel();
          this.educationWindow = false;
        } else {
          this.toastr.error(
            this.language.adminErrorCreateTitle,
            this.language.adminErrorCreateText,
            { timeOut: 7000, positionClass: "toast-bottom-right" }
          );
        }
      });
    }
  }

  saveAdditionalInfo() {
    if (!this.additionalInfoCreate) {
      this.service
        .updateAdditionalInfo(this.additionalInfo)
        .subscribe((data) => {
          if (data) {
            this.toastr.success(
              this.language.adminSuccessUpdateTitle,
              this.language.adminSuccessUpdateText,
              { timeOut: 7000, positionClass: "toast-bottom-right" }
            );
            this.educationWindow = false;
            this.education = new EducationModel();
          } else {
            this.toastr.error(
              this.language.adminErrorUpdateTitle,
              this.language.adminErrorUpdateText,
              { timeOut: 7000, positionClass: "toast-bottom-right" }
            );
          }
        });
    } else {
      this.additionalInfo.id_user = this.id;
      this.service
        .createAdditionalInfo(this.additionalInfo)
        .subscribe((data) => {
          if (data["success"]) {
            this.toastr.success(
              this.language.adminSuccessCreateTitle,
              this.language.adminSuccessCreateText,
              { timeOut: 7000, positionClass: "toast-bottom-right" }
            );
            this.allEducation.push(this.education);
            this.education = new EducationModel();
            this.educationWindow = false;
          } else {
            this.toastr.error(
              this.language.adminErrorCreateTitle,
              this.language.adminErrorCreateText,
              { timeOut: 7000, positionClass: "toast-bottom-right" }
            );
          }
        });
    }
  }

  saveBankAccount() {
    if (this.helpService.validate(this.bankAccount.iban)) {
      this.bankAccount.telephone = this.data.phoneNumber;
      this.bankAccount.mobile = this.data.mobile1;
      if (!this.bankAccountCreate) {
        this.service.updateBankAccount(this.bankAccount).subscribe((data) => {
          if (data) {
            this.toastr.success(
              this.language.adminSuccessUpdateTitle,
              this.language.adminSuccessUpdateText,
              { timeOut: 7000, positionClass: "toast-bottom-right" }
            );
            this.educationWindow = false;
            this.education = new EducationModel();
          } else {
            this.toastr.error(
              this.language.adminErrorUpdateTitle,
              this.language.adminErrorUpdateText,
              { timeOut: 7000, positionClass: "toast-bottom-right" }
            );
          }
        });
      } else {
        this.bankAccount.id_user = this.id;
        this.service.createBankAccount(this.bankAccount).subscribe((data) => {
          if (data["success"]) {
            this.toastr.success(
              this.language.adminSuccessCreateTitle,
              this.language.adminSuccessCreateText,
              { timeOut: 7000, positionClass: "toast-bottom-right" }
            );
            this.allEducation.push(this.education);
            this.education = new EducationModel();
            this.educationWindow = false;
          } else {
            this.toastr.error(
              this.language.adminErrorCreateTitle,
              this.language.adminErrorCreateText,
              { timeOut: 7000, positionClass: "toast-bottom-right" }
            );
          }
        });
      }
      this.badIBAN = false;
    } else {
      this.badIBAN = true;
      this.toastr.error(
        this.language.adminErrorBadIBANTitle,
        this.language.adminErrorBadIBANTitle,
        { timeOut: 7000, positionClass: "toast-bottom-right" }
      );
    }
  }

  

  selectedSalutation(event) {
    this.data.salutation = event;
  }

  selectedRelationship() {
    this.data.relationship = event;
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
      this.service.updatePassword(this.changePasswordData).subscribe((data) => {
        if (data) {
          this.toastr.success(
            this.language.adminSuccessUpdateTitle,
            this.language.adminSuccessUpdateText,
            { timeOut: 7000, positionClass: "toast-bottom-right" }
          );
          this.educationWindow = false;
          this.education = new EducationModel();
        } else {
          this.toastr.error(
            this.language.adminErrorUpdateTitle,
            this.language.adminErrorUpdateText,
            { timeOut: 7000, positionClass: "toast-bottom-right" }
          );
        }
        this.changePasswordWindow = false;
      });
    }
  }
}
