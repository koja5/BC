import { Component, OnInit } from "@angular/core";
import { ContactModel } from "src/app/models/contact-model";
import { MailService } from "src/app/services/mail.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
})
export class ContactComponent implements OnInit {
  public language: any;
  public data = new ContactModel();

  constructor(
    private service: MailService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.language = JSON.parse(localStorage.getItem("language"));
  }

  submitForm() {
    this.data["language"] = {
      sendQuestionSubjectTitle: this.language.sendQuestionSubjectTitle,
      sendQuestionBCITitle: this.language.sendQuestionBCITitle,
      sendQuestionRegardsFirst: this.language.sendQuestionRegardsFirst,
      sendQuestionMessage: this.language.sendQuestionMessage,
      sendQuestionName: this.language.sendQuestionName,
      sendQuestionPhone: this.language.sendQuestionPhone,
      sendQuestionEmail: this.language.sendQuestionEmail,
      sendQuestionSubject: this.language.sendQuestionSubject,
      sendQuestionMessageClient: this.language.sendQuestionMessageClient,
      sendQuestionRegardsEnd: this.language.sendQuestionRegardsEnd,
      sendQuestionBCISignature: this.language.sendQuestionBCISignature,
      sendQuestionThanksForUsing: this.language.sendQuestionThanksForUsing,
      sendQuestionHaveQuestion: this.language.sendQuestionHaveQuestion,
      sendQuestionGenerateMail: this.language.sendQuestionGenerateMail,
      sendQuestionCopyright: this.language.sendQuestionCopyright,
    };
    this.service.sendQuestion(this.data).subscribe((data) => {
      console.log(data);
      if (data) {
        this.toastr.success(
          this.language.successfulSendMessageText,
          this.language.successfulSendMessageTitle,
          {
            timeOut: 7000,
            positionClass: "toast-bottom-right",
          }
        );
        setTimeout(() => {
          this.router.navigate(["/home/main/feed"]);
        }, 4000);
      } else {
        this.toastr.error(
          this.language.errorSendMessageText,
          this.language.errorSendMessageTitle,
          {
            timeOut: 7000,
            positionClass: "toast-bottom-right",
          }
        );
      }
    });
  }
}
