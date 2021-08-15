import { HelpService } from './../../../services/help.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-life-event-details-dialog',
  templateUrl: './life-event-details-dialog.component.html',
  styleUrls: ['./life-event-details-dialog.component.scss']
})
export class LifeEventDetailsDialogComponent implements OnInit {

  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  @Input() data: any;
  public language;

  constructor(private helpService: HelpService) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();
  }

}
