import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-education-dialog',
  templateUrl: './education-dialog.component.html',
  styleUrls: ['./education-dialog.component.scss']
})
export class EducationDialogComponent implements OnInit {

  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  @Input() education: any;
  @Input() addObject: any;

  language: any;

  constructor(private helpService: HelpService,
    private router: Router) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();
  }

}
