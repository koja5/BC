import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { InviteModel } from 'src/app/models/invite-model';
import { MessageSubmitModel } from 'src/app/models/message-submit-model';
import { FeedService } from 'src/app/services/feed.service';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-feed-invite-dialog',
  templateUrl: './feed-invite-dialog.component.html',
  styleUrls: ['./feed-invite-dialog.component.scss']
})
export class FeedInviteDialogComponent implements OnInit {

  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  public inviteInfo = new MessageSubmitModel();
  public invite = new InviteModel();

  public language;

  constructor(private helpService: HelpService,
    private feedService: FeedService,

  ) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();
  }

  sendInviteFriend(invite) {
    console.log(this.invite);
    if (this.invite.email && this.invite.message) {
      this.invite.directorId = localStorage.getItem("id");
      this.invite["language"] = {
        inviteFriendSubject: this.language.inviteFriendSubject,
        inviteFriendBCITitle: this.language.inviteFriendBCITitle,
        inviteFriendJoinTo: this.language.inviteFriendJoinTo,
        inviteFriendThanksForUsing: this.language.inviteFriendThanksForUsing,
        inviteFriendHaveQuestion: this.language.inviteFriendHaveQuestion,
        inviteFriendGenerateMail: this.language.inviteFriendGenerateMail,
        inviteFriendCopyright: this.language.inviteFriendCopyrigh,
      };
      this.feedService.sendInviteFriend(this.invite).subscribe((data) => {
        console.log(data);
      });

      this.inviteInfo.show = true;
      this.inviteInfo.status = "success";
      this.inviteInfo.message = this.language.feedYourInviteIsSend;

      setTimeout(() => {
        this.modal.close();
      }, 2000);
    } else {
      this.inviteInfo.show = true;
      this.inviteInfo.status = "error";
      this.inviteInfo.message = this.language.feedInputAllRequired;
    }
  }


}
