import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  Input,
} from "@angular/core";
import {
  process,
  State,
  GroupDescriptor,
  SortDescriptor,
} from "@progress/kendo-data-query";
import { UploadEvent, SelectEvent } from "@progress/kendo-angular-upload";
import {
  DataStateChangeEvent,
  PageChangeEvent,
  RowArgs,
  DataBindingDirective,
} from "@progress/kendo-angular-grid";
import { WindowModule } from "@progress/kendo-angular-dialog";
import * as XLSX from "ts-xlsx";
import { Router } from "@angular/router";
import { CustomGridService } from "src/app/services/custom-grid.service";
import { ToastrService } from "ngx-toastr";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { UserModel } from "src/app/models/user-model";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { HelpService } from "src/app/services/help.service";
import { BankAccountModel } from "src/app/models/bank-account-model";
import { EditProfileService } from "src/app/services/edit-profile.service";
import * as sha1 from "sha1";
import { AdditionalInfoModel } from "src/app/models/additional-info-model";
import { LookingOfferModel } from "src/app/models/looking-offer-model";
import { ChangePasswordModel } from "src/app/models/change-password-model";

@Component({
  selector: "app-custom-grid",
  templateUrl: "./custom-grid.component.html",
  styleUrls: ["./custom-grid.component.scss"],
})
export class CustomGridComponent implements OnInit {
  @Input() data: any;
  @Input() gridConfiguration: any;

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
  public language: any;
  public selectedUser: any;
  public imagePath = "defaultUser";
  public loading = true;
  // public uploadSaveUrl = 'http://localhost:3000/api/uploadImage'; // should represent an actual API endpoint
  public uploadSaveUrl = "http://78.47.206.131:8080/uploadImage";
  public uploadRemoveUrl = "removeUrl"; // should represent an actual API endpoint
  // private spread: GC.Spread.Sheets.Workbook;
  // private excelIO;
  public customerDialogOpened = false;
  public fileValue: any;
  public theme: string;
  private mySelectionKey(context: RowArgs): string {
    return JSON.stringify(context.index);
  }
  private arrayBuffer: any;
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
  public selectedTab = "profile";
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

  constructor(
    private router: Router,
    private service: CustomGridService,
    private toastr: ToastrService,
    private helpService: HelpService,
    public serviceEditProfile: EditProfileService
  ) {
    this.allData = this.allData.bind(this);
  }

  ngOnInit() {
    console.log(this.data);
    this.currentLoadData = this.data;
    this.height = window.innerHeight - 81;
    this.height += "px";

    if (localStorage.getItem("language") !== null) {
      this.language = JSON.parse(localStorage.getItem("language"));
    }

    if (localStorage.getItem("theme") !== null) {
      this.theme = localStorage.getItem("theme");
    }

    this.initialize();
    this.getLanguageItems();
  }

  getLanguageItems() {
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
  }

  initialize() {
    this.gridView = process(this.currentLoadData, this.state);
  }

  selectionChange(event) {
    console.log(event);
  }

  filterUserType(event) {
    console.log(event);
    if (event !== undefined) {
      const data = this.data.filter((x) => x.type === event.id);
      this.gridView = process(data, this.state);
    } else {
      this.gridView = process(this.data, this.state);
    }
    this.selectedUserTypeFilter = event;
  }

  selectionUserType(event) {}

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.currentLoadData, this.state);
    if (this.state.filter !== null && this.state.filter.filters.length === 0) {
      this.gridView.total = this.currentLoadData.length;
    }
  }

  pageChange(event: PageChangeEvent): void {
    this.state.skip = event.skip;
    this.state.take = event.take;
    this.pageSize = event.take;
    this.loadProducts();
  }

  loadProducts(): void {
    this.gridView = process(this.data, this.state);
  }

  previewUser(selectedUser) {
    console.log(selectedUser);
    this.selectedUser = selectedUser;
  }

  uploadEventHandler(e: UploadEvent) {
    console.log(e);
  }

  action(event) {}

  onFileChange(args) {
    this.customerDialogOpened = true;
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: false }));
      setTimeout(() => {
        if (XLSX.utils.sheet_to_json(worksheet, { raw: true }).length > 0) {
          this.gridData = this.xlsxToJson(
            XLSX.utils.sheet_to_json(worksheet, { raw: true })
          );
          this.fileValue = null;
          this.gridView = this.gridData;
        }
      }, 50);
    };
    fileReader.readAsArrayBuffer(args.target.files[0]);
  }

  xlsxToJson(data) {
    const rowCount = data.length;
    const objectArray = [];
    const columns = Object.keys(data[0]);
    const columnCount = columns.length;
    const dataArray = [];

    for (let i = 0; i < rowCount; i++) {
      const object = {};
      for (let j = 0; j < columnCount; j++) {
        console.log(data[i][columns[j]]);
        object[columns[j]] = data[i][columns[j]];
      }
      objectArray.push(object);
      dataArray.push(objectArray[i]);
    }
    const allData = {
      table: "customers",
      columns: columns,
      data: dataArray,
    };
    return allData;
  }

  closeCustomer() {
    this.customer = false;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    console.log(window.innerHeight);
    this.height = window.innerHeight - 81;
    this.height += "px";
  }

  public onFilter(inputValue: string): void {
    this.searchFilter = inputValue;
    this.state.skip = 0;
    let filterItemList = this.makeFilterItems(inputValue);
    console.log(filterItemList);
    this.gridData = process(this.currentLoadData, {
      filter: {
        logic: "or",
        filters: filterItemList,
      },
    });
    this.gridView = process(this.gridData.data, this.state);
  }

  public makeFilterItems(inputValue) {
    let filterItemsList = [];
    for (let i = 0; i < this.gridConfiguration.columns.length; i++) {
      if (
        this.gridConfiguration.columns[i].field !== undefined &&
        this.gridConfiguration.columns[i].field !== "active"
      ) {
        const filterItem = {
          field: this.gridConfiguration.columns[i].field,
          operator: "contains",
          value: inputValue,
        };
        filterItemsList.push(filterItem);
      }
    }
    return filterItemsList;
  }

  public groupChange(groups: GroupDescriptor[]): void {
    this.state.group = groups;
    this.gridView = process(this.data, this.state);
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.state.sort = sort;
    this.gridView = process(this.data, this.state);
  }

  public generateLink(link, param) {
    this.router.navigate([link, param]);
  }

  public openDialogDelete(id, method, index) {
    this.id = id;
    this.method = method;
    this.index = index;
    this.dialogDelete = true;
  }

  public dialogDeleteAction(answer) {
    if (answer === "yes") {
      this.service[this.method](this.id).subscribe((data) => {
        console.log(data);
        if (data) {
          console.log(this.index);
          this.gridView.data.splice(this.index - this.state.take, 1);
          this.gridView.total -= 1;
        }
      });
    }
    this.dialogDelete = false;
  }

  editMember(dataItem) {
    this.member = dataItem;
    this.member.type = Number(this.member.type);
    this.member.birthday = this.convertToDate(this.member.birthday);
    this.member.activeDate = this.convertToDate(this.member.activeDate);
    this.member.activePremiumDate = this.convertToDate(
      this.member.activePremiumDate
    );
    this.operationMode = "edit";
    this.memberWindow = true;
    this.directorId = Number(
      this.helpService.getMyDirectorUser(this.member.id, this.member.sid)
    );
    console.log(this.directorId);
    this.oldDirectorId = this.directorId.toString();
    this.directorLoading = true;
    this.service.getDirectors().subscribe((data) => {
      this.allDirectors = data;
      this.currentLoadDirector = data;
      this.directorLoading = false;
    });
    this.selectedTab = "profile";
  }

  convertToDate(date) {
    if (date) {
      return new Date(date);
    }
    return null;
  }

  newMember() {
    this.member = new UserModel();
    this.member.image = "no-image.png";
    this.operationMode = "add";
    this.memberWindow = true;
  }

  updateMember(data) {
    this.service.updateMember(this.member).subscribe((data) => {
      if (data) {
        this.toastr.success(
          this.language.adminSuccessUpdateTitle,
          this.language.adminSuccessUpdateText,
          {
            timeOut: 7000,
            positionClass: "toast-bottom-right",
          }
        );
      } else {
        this.toastr.error(
          this.language.adminErrorUpdateTitle,
          this.language.adminErrorUpdateText,
          {
            timeOut: 7000,
            positionClass: "toast-bottom-right",
          }
        );
      }
      this.memberWindow = false;
    });
  }

  createNewMember(data) {
    this.service.createMember(this.member).subscribe((data) => {
      if (data["success"]) {
        this.member.id = data["id"];
        this.gridView.push(this.member);
        this.toastr.success(
          this.language.adminSuccessCreateTitle,
          this.language.adminSuccessCreateText,
          {
            timeOut: 7000,
            positionClass: "toast-bottom-right",
          }
        );
      } else {
        this.toastr.error(
          this.language.adminErrorCreateTitle,
          this.language.adminErrorCreateText,
          {
            timeOut: 7000,
            positionClass: "toast-bottom-right",
          }
        );
      }
      this.memberWindow = false;
    });
  }

  selectedSalutation(event) {
    this.member.salutation = event;
  }

  selectedRelationship(event) {
    this.member.relationship = event;
  }

  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: this.currentLoadData,
    };

    return result;
  }

  searchDirector(value) {
    if (value) {
      this.allDirectors = this.currentLoadDirector.filter(
        (s) => s.fullname.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.allDirectors = this.currentLoadDirector;
    }
  }

  selectedDirector(event) {
    console.log(event);
    if (event) {
      /*this.directorId = event;
      const newId = event.toString();
      this.member.sid = this.member.sid.replace(this.oldDirectorId, newId);
      console.log(this.member.sid);
      this.oldDirectorId = this.directorId.toString();*/
      const newSID = this.getDirectorSID(event);
      this.member.sid = newSID + "-" + this.member.id;
    } else {
      this.directorId = null;
    }
  }

  getDirectorSID(id) {
    for (let i = 0; i < this.allDirectors.length; i++) {
      if (this.allDirectors[i].id === id) {
        return this.allDirectors[i].sid;
      }
    }
    return null;
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

  saveBankAccount(data) {
    if (this.helpService.validate(this.bankAccount.iban)) {
      this.bankAccount.telephone = this.data.phoneNumber;
      this.bankAccount.mobile = this.data.mobile1;
      if (!this.bankAccountCreate) {
        this.serviceEditProfile
          .updateBankAccount(this.bankAccount)
          .subscribe((data) => {
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
          });
      } else {
        this.bankAccount.id_user = sha1(this.member.id.toString());
        this.serviceEditProfile
          .createBankAccount(this.bankAccount)
          .subscribe((data) => {
            if (data["success"]) {
              this.toastr.success(
                this.language.adminSuccessCreateTitle,
                this.language.adminSuccessCreateText,
                { timeOut: 7000, positionClass: "toast-bottom-right" }
              );
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

  saveAdditionalInfo() {
    if (!this.additionalInfoCreate) {
      this.serviceEditProfile
        .updateAdditionalInfo(this.additionalInfo)
        .subscribe((data) => {
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
        });
    } else {
      this.additionalInfo.id_user = sha1(this.member.id.toString());
      this.serviceEditProfile
        .createAdditionalInfo(this.additionalInfo)
        .subscribe((data) => {
          if (data["success"]) {
            this.toastr.success(
              this.language.adminSuccessCreateTitle,
              this.language.adminSuccessCreateText,
              { timeOut: 7000, positionClass: "toast-bottom-right" }
            );
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

  saveLookingOffer() {
    if (!this.lookingOfferCreate) {
      this.serviceEditProfile
        .updateLookingOffer(this.lookingOffer)
        .subscribe((data) => {
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
        });
    } else {
      this.lookingOffer.id_user = sha1(this.member.id.toString());
      this.serviceEditProfile
        .createLookingOffer(this.lookingOffer)
        .subscribe((data) => {
          if (data["success"]) {
            this.toastr.success(
              this.language.adminSuccessCreateTitle,
              this.language.adminSuccessCreateText,
              { timeOut: 7000, positionClass: "toast-bottom-right" }
            );
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

  changePassword() {
    this.passwordIsNotEqual = false;
    if (this.changePasswordData.new !== this.changePasswordData.newRepeat) {
      this.passwordIsNotEqual = true;
    } else {
      this.member.password = sha1(this.changePasswordData.new);
      this.service.updateMember(this.member).subscribe((data) => {
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
        this.changePasswordWindow = false;
      });
    }
  }
}
