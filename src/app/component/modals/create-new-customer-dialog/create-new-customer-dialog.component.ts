import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RowArgs } from '@progress/kendo-angular-grid';
import { State, GroupDescriptor } from '@progress/kendo-data-query';
import { ToastrService } from 'ngx-toastr';
import { AdditionalInfoModel } from 'src/app/models/additional-info-model';
import { BankAccountModel } from 'src/app/models/bank-account-model';
import { ChangePasswordModel } from 'src/app/models/change-password-model';
import { LookingOfferModel } from 'src/app/models/looking-offer-model';
import { CustomGridService } from 'src/app/services/custom-grid.service';
import { EditProfileService } from 'src/app/services/edit-profile.service';
import { HelpService } from 'src/app/services/help.service';
import { ModalConfigurationService } from 'src/app/services/modal-configuration.service';
import * as sha1 from "sha1";

@Component({
  selector: 'app-create-new-customer-dialog',
  templateUrl: './create-new-customer-dialog.component.html',
  styleUrls: ['./create-new-customer-dialog.component.scss']
})
export class CreateNewCustomerDialogComponent implements OnInit {

  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  public selectedTab = "profile";

  public language: any;
  @Input() data: any;
  @Input() gridConfiguration: any;
  @Output() sendEventEmitter = new EventEmitter<any>();

  // @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  public customer = false;
  public unamePattern = "^[a-z0-9_-]{8,15}$";
  public emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$";
  public userType = ["Employee", "Manager", "Admin"];
  public gridData: any;
  public gridView: any;
  public currentLoadData: any;
  public state: State = {
    skip: 0,
    take: 10,
    filter: null,
  };
  public groups: GroupDescriptor[] = [];
  public storeLocation: any;
  public selectedUser: any;
  public imagePath = "defaultUser";
  public loading = true;
  // public uploadSaveUrl = 'http://localhost:3000/api/uploadImage'; // should represent an actual API endpoint
  public uploadSaveUrl = "https://116.203.85.82:8080/uploadImage";
  public uploadRemoveUrl = "removeUrl"; // should represent an actual API endpoint
  // private spread: GC.Spread.Sheets.Workbook;
  // private excelIO;
  public customerDialogOpened = false;
  public fileValue: any;
  public theme: string;
  public height: any;
  public searchFilter: any;
  public pageSize = 5;
  public pageable = {
    pageSizes: true,
    previousNext: true,
  };
  public dialogDelete = false;
  public id: any;
  public method: any;
  public index: number;
  public filterColumns: [];
  public memberWindow = false;
  public member: any;
  public typeOfUsers = [
    {
      id: 1,
      type: "business",
    },
    {
      id: 2,
      type: "member",
    },
    {
      id: 3,
      type: "business - not pay",
    },
  ];
  public operationMode: any;
  public allServerData: any;
  public exportServerInd = false;
  public selectedUserTypeFilter: any;
  public salutationItem: any;
  public relationshipItem: any;
  public directorId: any;
  public allDirectors: any;
  public directorLoading = false;
  public currentLoadDirector: any;
  public oldDirectorId: any;
  public bankAccount = new BankAccountModel();
  public bankAccountCreate = false;
  public badIBAN = false;
  public additionalInfo = new AdditionalInfoModel();
  public additionalInfoCreate = false;
  public lookingOffer = new LookingOfferModel();
  public lookingOfferCreate = false;
  public changePasswordWindow = false;
  public changePasswordData = new ChangePasswordModel();
  public passwordIsNotEqual = false;
  public eventWindow = false;

  constructor(
    private helpService: HelpService,
    public serviceEditProfile: EditProfileService,
  ) {
  }
  ngOnInit() {
    this.language = this.helpService.getLanguage();
  }
  changeTab(tab) {
    this.selectedTab = tab;
    if (tab === "bankAccount") {
      this.bankAccount = new BankAccountModel();
      this.serviceEditProfile
        .getBankAccount(sha1(this.member.id.toString()))
        .subscribe((data) => {
          if (data["length"] > 0) {
            this.bankAccount = data[0];
          } else {
            this.bankAccountCreate = true;
          }
        });
    } else if (tab === "other") {
      this.additionalInfo = new AdditionalInfoModel();
      this.serviceEditProfile
        .getAdditionalInfo(sha1(this.member.id.toString()))
        .subscribe((data) => {
          if (data["length"] > 0) {
            this.additionalInfo = data[0];
          } else {
            this.additionalInfoCreate = true;
          }
        });
    } else if (tab === "lookingOffer") {
      this.lookingOffer = new LookingOfferModel();
      this.serviceEditProfile
        .getLookingOffer(sha1(this.member.id.toString()))
        .subscribe((data) => {
          if (data["length"] > 0) {
            this.lookingOffer = data[0];
          } else {
            this.lookingOfferCreate = true;
          }
        });
    }
  }
}
