import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventModel } from 'src/app/models/event-model';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-create-event-type-dialog',
  templateUrl: './create-event-type-dialog.component.html',
  styleUrls: ['./create-event-type-dialog.component.scss']
})
export class CreateEventTypeDialogComponent implements OnInit {

  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  @Input() operationMode: any;
  @Output() sendEventEmitter = new EventEmitter<any>();

  public create = new EventModel();
  public language: any;


  constructor(private helpService: HelpService) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();
    this.create = this.modalSettings.resolve.dataItem();
  }

  sendAction(operation, data) {
    const actionData = {
      operation: operation,
      data: data,
    };
    this.sendEventEmitter.emit(actionData);
  }

}
