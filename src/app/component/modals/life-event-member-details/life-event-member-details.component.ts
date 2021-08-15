import { HelpService } from './../../../services/help.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as sha1 from "sha1";
import { Router } from '@angular/router';

@Component({
  selector: 'app-life-event-member-details',
  templateUrl: './life-event-member-details.component.html',
  styleUrls: ['./life-event-member-details.component.scss']
})
export class LifeEventMemberDetailsComponent implements OnInit {

  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  @Input() memberGoingList: any;

  public language;

  constructor(private helpService: HelpService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();

  }

  openProfile(id) {
    this.router.navigate(["/home/main/profile/" + sha1(id.toString())]);
  }

}
