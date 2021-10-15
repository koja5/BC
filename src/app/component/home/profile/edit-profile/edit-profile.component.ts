import { EducationDialogComponent } from './../../../modals/education-dialog/education-dialog.component';
import { ExperienceDialogComponent } from './../../../modals/experience-dialog/experience-dialog.component';
import { ChangePasswordDialogComponent } from './../../../modals/change-password-dialog/change-password-dialog.component';
import { ModalConfigurationService } from './../../../../services/modal-configuration.service';
import { Component, OnInit, HostListener } from "@angular/core";
import { EditProfileService } from "src/app/services/edit-profile.service";
import { ToastrService } from "ngx-toastr";
import { MessageService } from "src/app/services/message.service";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { ExperienceModel } from "src/app/models/experience-model";
import { EducationModel } from "src/app/models/education-model";
import { LookingOfferModel } from "src/app/models/looking-offer-model";
import { AdditionalInfoModel } from "src/app/models/additional-info-model";
import { BankAccountModel } from "src/app/models/bank-account-model";
import { HelpService } from 'src/app/services/help.service';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { DynamicDialogComponent } from "src/app/component/dynamic-elements/dynamic-dialog/dynamic-dialog.component";

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
  public windowWidth: any;
  public windowHeight: any;
  public selectedExperience: any;
  public allEducation: any = [];
  public education = new EducationModel();
  public selectedEducation: any;
  public lookingOffer = new LookingOfferModel();
  public lookingOfferCreate = false;
  public additionalInfo = new AdditionalInfoModel();
  public additionalInfoCreate = false;
  public bankAccount = new BankAccountModel();
  public bankAccountCreate = false;
  public badIBAN = false;
  public salutationItem: any;
  public relationshipItem: any;

  constructor(
    private editProfileService: EditProfileService,
    private toastr: ToastrService,
    private message: MessageService,
    public helpService: HelpService,
    private modalService: NgbModal,
    private modalConfigurationService: ModalConfigurationService
  ) { }

  ngOnInit() {
    this.id = localStorage.getItem("id");
    this.language = this.helpService.getLanguage();
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
    this.editProfileService.getUserInfoSHA1(this.id).subscribe((data) => {
      this.data = data[0];
      this.data.birthday = new Date(data[0].birthday);
    });

    this.getExperience();

    this.getEducation();

    this.editProfileService.getLookingOffer(this.id).subscribe((data) => {
      if (data["length"] > 0) {
        this.lookingOffer = data[0];
      } else {
        this.lookingOfferCreate = true;
      }
    });

    this.editProfileService.getAdditionalInfo(this.id).subscribe((data) => {
      if (data["length"] > 0) {
        this.additionalInfo = data[0];
      } else {
        this.additionalInfoCreate = true;
      }
    });

    this.editProfileService.getBankAccount(this.id).subscribe((data) => {
      if (data["length"] > 0) {
        this.bankAccount = data[0];
      } else {
        this.bankAccountCreate = true;
      }
    });
  }

  getExperience() {
    this.editProfileService.getExperience(this.id).subscribe((data: []) => {
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
    this.editProfileService.getEducation(this.id).subscribe((data: []) => {
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
    this.editProfileService.editUser(this.data).subscribe((data) => {
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
    this.editProfileService.createExperience(this.experience).subscribe((data) => {
      if (data["success"]) {
        this.toastr.success(
          this.language.adminSuccessCreateTitle,
          this.language.adminSuccessCreateText,
          { timeOut: 7000, positionClass: "toast-bottom-right" }
        );
        // this.allExperience.push(this.experience);
        this.experience = new ExperienceModel();
        this.getExperience();
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

  addNewExperience() {
    const modalRef = this.modalService.open(ExperienceDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.profileExperienceTitle,
        text: () => null,
        imageUrl: () => null,
        primaryButtonLabel: () => this.language.profileSave,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;
    this.experience = new ExperienceModel();
    modalRef.componentInstance.experience = this.experience;

    modalRef.result.then(() => {
      this.saveExperience();
    }, () => {
      console.log(`Dismissed education dialog`);
    });
  }


  editExperience(i) {
    this.experience = this.allExperience[i];
    this.selectedExperience = {
      index: i,
      data: this.allExperience[i],
    };

    const modalRef = this.modalService.open(ExperienceDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.profileExperienceTitle,
        text: () => null,
        imageUrl: () => null,
        primaryButtonLabel: () => this.language.profileSave,
        secondaryButtonLabel: () => this.language.profileDelete
      }
    };
    modalRef.componentInstance.experience = this.allExperience[i];
    modalRef.componentInstance.modal = modalRef;

    modalRef.result.then(() => {
      this.updateExperience();
    }, (reason) => {
      if (reason === 'secondary-button-clicked') {
        this.openDeleteExperienceDialog();
      }
    });
  }

  updateExperience() {
    this.editProfileService.updateExperience(this.experience).subscribe((data) => {
      if (data) {
        this.toastr.success(
          this.language.adminSuccessUpdateTitle,
          this.language.adminSuccessUpdateText,
          { timeOut: 7000, positionClass: "toast-bottom-right" }
        );
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

  openDeleteExperienceDialog(): void {
    const modalRef = this.openDeleteDialog();
    modalRef.result.then(() => {
      this.deleteExperience();
    }, () => {
      console.log(`Dismissed`)
    });
  }

  deleteExperience() {
    this.editProfileService
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

  addNewEducation(): void {
    const modalRef = this.modalService.open(EducationDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.profileEducationTitle,
        text: () => null,
        imageUrl: () => null,
        primaryButtonLabel: () => this.language.profileSave,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;
    this.education = new EducationModel();
    modalRef.componentInstance.education = this.education;

    modalRef.result.then(() => {
      this.saveEducation();
    }, () => {
      console.log(`Dismissed education dialog`);
    });
  }

  saveEducation() {
    this.education.id_user = this.id;
    this.editProfileService.createEducation(this.education).subscribe((data) => {
      if (data["success"]) {
        this.toastr.success(
          this.language.adminSuccessCreateTitle,
          this.language.adminSuccessCreateText,
          { timeOut: 7000, positionClass: "toast-bottom-right" }
        );
        // this.allEducation.push(this.education);
        this.education = new EducationModel();
        this.getEducation();
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

    const modalRef = this.modalService.open(EducationDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.profileEducationTitle,
        text: () => null,
        imageUrl: () => null,
        primaryButtonLabel: () => this.language.profileSave,
        secondaryButtonLabel: () => this.language.profileDelete
      }
    };
    modalRef.componentInstance.education = this.allEducation[i];
    modalRef.componentInstance.modal = modalRef;

    modalRef.result.then(() => {
      this.updateEducation();
    }, (reason) => {
      if (reason === 'secondary-button-clicked') {
        this.openDeleteEducationDialog();
      }
    });
  }

  updateEducation() {
    this.editProfileService.updateEducation(this.education).subscribe((data) => {
      if (data) {
        this.toastr.success(
          this.language.adminSuccessUpdateTitle,
          this.language.adminSuccessUpdateText,
          { timeOut: 7000, positionClass: "toast-bottom-right" }
        );
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

  openDeleteEducationDialog(): void {
    const modalRef = this.openDeleteDialog();
    modalRef.result.then(() => {
      this.deleteEducation();
    }, () => {
      console.log(`Dismissed`)
    });
  }

  deleteEducation() {
    this.editProfileService
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

  saveLookingOffer() {
    if (!this.lookingOfferCreate) {
      this.editProfileService.updateLookingOffer(this.lookingOffer).subscribe((data) => {
        if (data) {
          this.toastr.success(
            this.language.adminSuccessUpdateTitle,
            this.language.adminSuccessUpdateText,
            { timeOut: 7000, positionClass: "toast-bottom-right" }
          );
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
      this.editProfileService.createLookingOffer(this.lookingOffer).subscribe((data) => {
        if (data["success"]) {
          this.toastr.success(
            this.language.adminSuccessCreateTitle,
            this.language.adminSuccessCreateText,
            { timeOut: 7000, positionClass: "toast-bottom-right" }
          );
          this.allEducation.push(this.education);
          this.education = new EducationModel();
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
      this.editProfileService
        .updateAdditionalInfo(this.additionalInfo)
        .subscribe((data) => {
          if (data) {
            this.toastr.success(
              this.language.adminSuccessUpdateTitle,
              this.language.adminSuccessUpdateText,
              { timeOut: 7000, positionClass: "toast-bottom-right" }
            );
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
      this.editProfileService
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
        this.editProfileService.updateBankAccount(this.bankAccount).subscribe((data) => {
          if (data) {
            this.toastr.success(
              this.language.adminSuccessUpdateTitle,
              this.language.adminSuccessUpdateText,
              { timeOut: 7000, positionClass: "toast-bottom-right" }
            );
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
        this.editProfileService.createBankAccount(this.bankAccount).subscribe((data) => {
          if (data["success"]) {
            this.toastr.success(
              this.language.adminSuccessCreateTitle,
              this.language.adminSuccessCreateText,
              { timeOut: 7000, positionClass: "toast-bottom-right" }
            );
            this.allEducation.push(this.education);
            this.education = new EducationModel();
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

  openChangePasswordModal(): void {
    const modalRef = this.modalService.open(ChangePasswordDialogComponent, {
      size: 'sm',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.changePasswordTitle,
        text: () => null,
        imageUrl: () => null,
        primaryButtonLabel: () => null,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;
  }

  private openDeleteDialog(): NgbModalRef {
    const modalRef = this.modalService.open(DynamicDialogComponent, {
      size: 'lg',
      centered: true
    });

    this.modalConfigurationService.setSettingsForAreYouSureDialog(modalRef.componentInstance, this.language);
    modalRef.componentInstance.modal = modalRef;

    return modalRef;
  }

}
