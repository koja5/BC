import { DynamicDialogComponent } from './../dynamic-elements/dynamic-dialog/dynamic-dialog.component';
import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelpService } from 'src/app/services/help.service';
import { ModalConfigurationService } from 'src/app/services/modal-configuration.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  public language;

  constructor(private modalService: NgbModal,
    private helpService: HelpService,
    private modalConfigurationService: ModalConfigurationService
    ) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();
  }
  
  openModal():void{
    const modalRef=this.modalService.open(DynamicDialogComponent, {
      size:'lg',
      centered:true
    });
    
    this.modalConfigurationService.setSettingsForAreYouSureDialog(modalRef.componentInstance, this.language);
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
