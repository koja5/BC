import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-experience-dialog',
  templateUrl: './experience-dialog.component.html',
  styleUrls: ['./experience-dialog.component.scss']
})
export class ExperienceDialogComponent implements OnInit {


  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  @Input() experience: any;


  language: any;

  constructor(private helpService: HelpService,
    private router: Router) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();

  }

}
