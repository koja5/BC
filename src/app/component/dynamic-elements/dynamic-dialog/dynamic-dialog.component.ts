import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dynamic-dialog',
  templateUrl: './dynamic-dialog.component.html',
  styleUrls: ['./dynamic-dialog.component.scss']
})
export class DynamicDialogComponent implements OnInit {

  @Input() modal:NgbModalRef;
  @Input() modalSettings:any;

  public title:string;
  public primaryButtonLabel:string;
  public secondaryButtonLabel:string;
  public imageUrl:string;
  public text:string;

  constructor() { }

  ngOnInit() {
    this.title=this.modalSettings.resolve.title();
    this.primaryButtonLabel=this.modalSettings.resolve.primaryButtonLabel();
    this.secondaryButtonLabel=this.modalSettings.resolve.secondaryButtonLabel();
    this.imageUrl=this.modalSettings.resolve.imageUrl();
    this.text=this.modalSettings.resolve.text();
  }

  public apply():void{
    this.modal.close('primary-button-clicked');
  }

  public dismiss():void{
    this.modal.dismiss('secondary-button-clicked');
  }

}
