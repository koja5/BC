import { DynamicDialogComponent } from './../dynamic-elements/dynamic-dialog/dynamic-dialog.component';
import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  public language;

  constructor(private modalService: NgbModal,
    private helpService: HelpService
    ) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();
  }
  
  openModal():void{
    const modalRef=this.modalService.open(DynamicDialogComponent, {
      size:'sm',
      centered:true
    });
    
    modalRef.componentInstance.modalSettings={
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.language.adminPleaseConfirm,
        text: () => this.language.areYouSure,
        imageUrl: ()=> '../../../../../assets/img/sent.png',
        primaryButtonLabel: () => this.language.yes,
        secondaryButtonLabel: () => this.language.no
      }
    };
    modalRef.componentInstance.modal=modalRef;
    
    modalRef.result.then((result) => {
     console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(`Dismissed ${this.getDismissReason(reason)}`)
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
