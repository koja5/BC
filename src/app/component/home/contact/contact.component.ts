import { Component, OnInit } from "@angular/core";
import { ContactModel } from "src/app/models/contact-model";
import { MailService } from "src/app/services/mail.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
})
export class ContactComponent implements OnInit {
  public language: any;
  public data = new ContactModel();

  constructor(private service: MailService, private toastr: ToastrService) {}

  ngOnInit() {
    this.language = JSON.parse(localStorage.getItem("language"));
  }

  submitForm() {
    this.service.sendQuestion(this.data).subscribe((data) => {
      console.log(data);
      if (data) {
        this.toastr.success(this.language.successfulSendMessageText, this.language.successfulSendMessageTitle, {
          timeOut: 7000,
          positionClass: "toast-bottom-right",
        });
      } else {
        this.toastr.error(this.language.errorSendMessageText, this.language.errorSendMessageTitle, {
          timeOut: 7000,
          positionClass: "toast-bottom-right",
        });
      }
    });
  }
}
