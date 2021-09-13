import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FeedService } from 'src/app/services/feed.service';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-feed-post-likes-dialog',
  templateUrl: './feed-post-likes-dialog.component.html',
  styleUrls: ['./feed-post-likes-dialog.component.scss']
})
export class FeedPostLikesDialogComponent implements OnInit {

  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  @Input() id: any;
  public postLikes = false;
  public allLikesForPost: any;
  public language;

  constructor(private helpService: HelpService,
    private feedService: FeedService,
  ) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();

    this.feedService.getLikesForPost(this.id).subscribe((data) => {
      this.allLikesForPost = data["likes"];
      this.postLikes = true;
    });
  }

}
