import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  Input
} from "@angular/core";
import { Modal } from "ngx-modal";
import {
  process,
  State,
  GroupDescriptor,
  SortDescriptor
} from "@progress/kendo-data-query";
import { UploadEvent, SelectEvent } from "@progress/kendo-angular-upload";
import {
  DataStateChangeEvent,
  PageChangeEvent,
  RowArgs,
  DataBindingDirective
} from "@progress/kendo-angular-grid";
import { WindowModule } from "@progress/kendo-angular-dialog";
import * as XLSX from "ts-xlsx";
import { Router } from "@angular/router";
import { CustomGridService } from "src/app/services/custom-grid.service";
import { ToastrService } from "ngx-toastr";
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: "app-custom-grid",
  templateUrl: "./custom-grid.component.html",
  styleUrls: ["./custom-grid.component.scss"]
})
export class CustomGridComponent implements OnInit {
  @Input() data: any;
  @Input() gridConfiguration: any;

  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
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
    filter: null
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
    previousNext: true
  };
  public dialogDelete = false;
  public id: any;
  public method: any;
  public index: number;

  constructor(
    private router: Router,
    private service: CustomGridService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    console.log(this.data);
    this.currentLoadData = this.data;
    this.height = window.innerHeight - 81;
    this.height += "px";

    if (localStorage.getItem("language") !== null) {
      this.language = JSON.parse(localStorage.getItem("language")).grid;
    }

    if (localStorage.getItem("theme") !== null) {
      this.theme = localStorage.getItem("theme");
    }

    this.initialize();
  }

  initialize() {
    this.gridView = process(this.currentLoadData, this.state);
  }

  selectionChange(event) {
    console.log(event);
  }

  selectionChangeStore(event) {
    console.log(event);
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.currentLoadData, this.state);
    if (this.state.filter !== null && this.state.filter.filters.length === 0) {
      this.gridView.total = this.currentLoadData.length;
    }
    this.changeTheme(this.theme);
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
    fileReader.onload = e => {
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
      data: dataArray
    };
    return allData;
  }

  closeCustomer() {
    this.customer = false;
  }

  changeTheme(theme: string) {
    setTimeout(() => {
      if (localStorage.getItem("allThemes") !== undefined) {
        const allThemes = JSON.parse(localStorage.getItem("allThemes"));
        console.log(allThemes);
        let items = document.querySelectorAll(".k-dialog-titlebar");
        for (let i = 0; i < items.length; i++) {
          const clas = items[i].classList;
          for (let j = 0; j < allThemes.length; j++) {
            const themeName = allThemes[j]["name"];
            console.log(clas);
            clas.remove("k-dialog-titlebar-" + themeName);
            clas.add("k-dialog-titlebar-" + theme);
          }
        }

        items = document.querySelectorAll(".k-header");
        for (let i = 0; i < items.length; i++) {
          const clas = items[i].classList;
          for (let j = 0; j < allThemes.length; j++) {
            const element = allThemes[j]["name"];
            clas.remove("gridHeader-" + element);

            clas.add("gridHeader-" + this.theme);
          }
        }
        items = document.querySelectorAll(".k-pager-numbers");
        for (let i = 0; i < items.length; i++) {
          const clas = items[i].classList;
          for (let j = 0; j < allThemes.length; j++) {
            const element = allThemes[j]["name"];
            clas.remove("k-pager-numbers-" + element);
            clas.add("k-pager-numbers-" + this.theme);
          }
        }

        items = document.querySelectorAll(".k-select");
        for (let i = 0; i < items.length; i++) {
          const clas = items[i].classList;
          for (let j = 0; j < allThemes.length; j++) {
            const element = allThemes[j]["name"];
            clas.remove("k-select-" + element);
            clas.add("k-select-" + this.theme);
          }
        }

        items = document.querySelectorAll(".k-grid-table");
        for (let i = 0; i < items.length; i++) {
          const clas = items[i].classList;
          for (let j = 0; j < allThemes.length; j++) {
            const element = allThemes[j]["name"];
            clas.remove("k-grid-table-" + element);
            clas.add("k-grid-table-" + this.theme);
          }
        }
        items = document.querySelectorAll(".k-grid-header");
        for (let i = 0; i < items.length; i++) {
          const clas = items[i].classList;
          for (let j = 0; j < allThemes.length; j++) {
            const element = allThemes[j]["name"];
            clas.remove("k-grid-header-" + element);
            clas.add("k-grid-header-" + this.theme);
          }
        }
        items = document.querySelectorAll(".k-pager-wrap");
        for (let i = 0; i < items.length; i++) {
          const clas = items[i].classList;
          for (let j = 0; j < allThemes.length; j++) {
            const element = allThemes[j]["name"];
            clas.remove("k-pager-wrap-" + element);
            clas.add("k-pager-wrap-" + this.theme);
          }
        }

        items = document.querySelectorAll(".k-button");
        for (let i = 0; i < items.length; i++) {
          const clas = items[i].classList;
          for (let j = 0; j < allThemes.length; j++) {
            const element = allThemes[j]["name"];
            clas.remove("inputTheme-" + element);
            clas.add("inputTheme-" + this.theme);
          }
        }
      }
    }, 50);
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
    this.gridData = process(this.currentLoadData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: "shortname",
            operator: "contains",
            value: inputValue
          },
          {
            field: "firstname",
            operator: "contains",
            value: inputValue
          },
          {
            field: "lastname",
            operator: "contains",
            value: inputValue
          },
          {
            field: "telephone",
            operator: "contains",
            value: inputValue
          },
          {
            field: "mobile",
            operator: "contains",
            value: inputValue
          },
          {
            field: "email",
            operator: "contains",
            value: inputValue
          }
        ]
      }
    });
    this.gridView = process(this.data, this.state);
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
      this.service[this.method](this.id).subscribe(data => {
        console.log(data);
        if (data) {
          console.log(this.index);
          this.gridView.data.splice(this.index, 1);
          this.gridView.total -= 1;
        }
      });
    }
    this.dialogDelete = false;
  }
}
