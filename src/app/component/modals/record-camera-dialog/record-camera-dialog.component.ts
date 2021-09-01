import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-record-camera-dialog',
  templateUrl: './record-camera-dialog.component.html',
  styleUrls: ['./record-camera-dialog.component.scss']
})
export class RecordCameraDialogComponent implements OnInit {
  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  @Input() width: any;
  @Input() height: any;
  constructor() { }

  ngOnInit() {
  }

}
