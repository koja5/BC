import { Component, OnInit } from "@angular/core";
import { HelpService } from 'src/app/services/help.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PremiumBuyDialogComponent } from "../../modals/premium-buy-dialog/premium-buy-dialog.component";

@Component({
  selector: "app-premium",
  templateUrl: "./premium.component.html",
  styleUrls: ["./premium.component.scss"],
})
export class PremiumComponent implements OnInit {
  public language: any;

  constructor(
    private helpService: HelpService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();
  }


  public openPremiumBuyDialog(): void {
    const modalRef = this.modalService.open(PremiumBuyDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.modalSettings = {
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.premiumBuy,
        text: () => null,
        imageUrl: () => null,
        imageStyle: () => null,
        primaryButtonLabel: () => null,
        secondaryButtonLabel: () => null
      }
    };
    modalRef.componentInstance.modal = modalRef;
  }
}
