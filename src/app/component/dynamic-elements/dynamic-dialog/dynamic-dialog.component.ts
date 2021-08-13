import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dynamic-dialog',
  templateUrl: './dynamic-dialog.component.html',
  styleUrls: ['./dynamic-dialog.component.scss']
})
export class DynamicDialogComponent implements OnInit {

  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;

  public title: string;
  public primaryButtonLabel: string;
  public secondaryButtonLabel: string;
  public imageUrl: string;
  public imageStyle: SafeStyle;
  public text: string;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.title = this.modalSettings.resolve.title();
    this.primaryButtonLabel = this.modalSettings.resolve.primaryButtonLabel();
    this.secondaryButtonLabel = this.modalSettings.resolve.secondaryButtonLabel();
    this.imageUrl = this.modalSettings.resolve.imageUrl();
    this.imageStyle = this.sanitizer.bypassSecurityTrustStyle(this.modalSettings.resolve.imageStyle());
    this.text = this.modalSettings.resolve.text();
  }

  public apply(): void {
    this.modal.close('primary-button-clicked');
  }

  public cancel(): void {
    this.modal.dismiss('secondary-button-clicked');
  }

  public dismiss(): void {
    this.modal.dismiss('cross click');
  }

}
