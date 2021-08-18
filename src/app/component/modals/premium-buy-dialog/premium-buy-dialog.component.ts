import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FacturaModel } from 'src/app/models/factura-model';
import { HelpService } from 'src/app/services/help.service';
import { ModalConfigurationService } from 'src/app/services/modal-configuration.service';
import { PremiumService } from 'src/app/services/premium.service';
import { ProfileService } from 'src/app/services/profile.service';
import { DynamicDialogComponent } from '../../dynamic-elements/dynamic-dialog/dynamic-dialog.component';

@Component({
  selector: 'app-premium-buy-dialog',
  templateUrl: './premium-buy-dialog.component.html',
  styleUrls: ['./premium-buy-dialog.component.scss']
})
export class PremiumBuyDialogComponent implements OnInit {

  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  language: any;
  public agree = true;
  public buyCompleted = false;
  public data = new FacturaModel();
  public id: any;

  constructor(private helpService: HelpService,
    private premiumService: PremiumService,
    private profileService: ProfileService,
    private router: Router,
    private modalService: NgbModal,
    private modalConfigurationService: ModalConfigurationService) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();
    this.id = localStorage.getItem("id");
  }

  finishBuyRedirect() {
    this.modal.dismiss();
    this.router.navigate(["/home/main/feed"]);
  }

  agreeWithTerms() {
    this.agree = false;
  }

  openAreYouSureDialog(): void {
    const modalRef = this.modalService.open(DynamicDialogComponent, {
      size: 'lg',
      centered: true
    });

    this.modalConfigurationService.setSettingsForAreYouSureDialog(modalRef.componentInstance, this.language);
    modalRef.componentInstance.modal = modalRef;

    modalRef.result.then(() => {
      this.buyAnswer('yes');
    }, () => {
      console.log(`Dismissed`)
    });
  }

  buyAnswer(answer) {
    if (answer === "yes") {
      this.profileService.getUserInfoSHA1(this.id).subscribe((user) => {
        if (user["length"] !== 0) {
          const data = {
            id: user[0].id,
          };
          this.premiumService.updatePaymentStatus(data).subscribe((pay) => {
            console.log(pay);
          });
          this.generateDataForMail(user[0]);
          this.premiumService.sendFacture(this.data).subscribe((data) => {
            console.log(data);
            if (data) {
              console.log(user[0].id);
            }
          });
        }
      });
      this.buyCompleted = true;
    }
  }

  generateDataForMail(user) {
    this.data.email = user.email;
    this.data.id = user.id;
    this.data.name = user.fullname;
    this.data.street = user.street;
    this.data.zip = user.zip;
    this.data.location = user.location;
    this.data.phone = user.phoneNumber;
    this.data.mobile1 = user.mobile1;
    this.data.mobile2 = user.mobile2;
    this.data.premiumSubject = this.language.premiumSubject;
    this.data.premiumInvoice = this.language.premiumInvoice;
    this.data.premiumStatus = this.language.premiumStatus;
    this.data.premiumPending = this.language.premiumPending;
    this.data.premiumBankAccount = this.language.premiumBankAccount;
    this.data.premiumOr = this.language.premiumOr;
    this.data.premiumScreenQRCode = this.language.premiumScreenQRCode;
    this.data.premiumItem = this.language.premiumItem;
    this.data.premiumUnitCost = this.language.premiumUnitCost;
    this.data.premiumQty = this.language.premiumQty;
    this.data.premiumTotal = this.language.premiumTotal;
    this.data.premiumPremiumAccount = this.language.premiumPremiumAccount;
    this.data.premiumThanksForUsing = this.language.premiumThanksForUsing;
    this.data.premiumHaveQuestion = this.language.premiumHaveQuestion;
    this.data.premiumAutomateMail = this.language.premiumAutomateMail;
    this.data.premiumCopyRight = this.language.premiumCopyRight;
    this.data.premiumRegardsFirst = this.language.premiumRegardsFirst;
    this.data.premiumRegardsEnd = this.language.premiumRegardsEnd;
    this.data.premiumConfirmMailBCISignature = this.language.premiumConfirmMailBCISignature;
    this.data.premiumMessage = this.language.premiumMessage;
    this.data.premiumItemPrice = this.language.premiumItemPrice;
    this.data.premiumItemCount = this.language.premiumItemCount;
    this.data.premiumItemTotal = this.language.premiumItemTotal;
  }

}
