import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FeedService } from 'src/app/services/feed.service';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-preview-post-dialog',
  templateUrl: './preview-post-dialog.component.html',
  styleUrls: ['./preview-post-dialog.component.scss']
})
export class PreviewPostDialogComponent implements OnInit {

  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  @Input() data: any;
  @Input() postData: any;

  public language;

  constructor(private helpService: HelpService) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();
  }

}
