import { HelpService } from './../../../services/help.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PrepareMailService } from 'src/app/services/help-services/prepare-mail.service';
import { ConnectionService } from 'src/app/services/connection.service';

@Component({
  selector: 'app-life-event-invite-friend-dialog',
  templateUrl: './life-event-invite-friend-dialog.component.html',
  styleUrls: ['./life-event-invite-friend-dialog.component.scss']
})
export class LifeEventInviteFriendDialogComponent implements OnInit {
  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  @Input() id: any;
  public language;
  public allMyConnection: any;
  public currentLoadData: any;
  public selectedInviteFriends = [];

  constructor(private helpService: HelpService,
    private prepareMail: PrepareMailService,
    private connectionService: ConnectionService
  ) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();

    this.connectionService
      .getAllMyConnections(localStorage.getItem("id"))
      .subscribe((data) => {
        this.allMyConnection = data;
        this.currentLoadData = data;
      });

  }

  handleFilter(value) {
    this.allMyConnection = this.currentLoadData.filter(
      (s) => s.fullname.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  isItemSelected(itemText: string): boolean {
    return this.selectedInviteFriends.some((item) => item.id === itemText);
  }

  selectAllMyFriends() {
    if (this.selectedInviteFriends.length !== this.currentLoadData.length) {
      this.selectedInviteFriends = this.currentLoadData;
    } else {
      this.selectedInviteFriends = [];
    }
  }

  sendInviteForSelectedFriends() {
    this.prepareMail.sendReminderForSelectedFriends(
      this.language,
      this.selectedInviteFriends,
      this.id
    );

    this.modal.close();
  }

  get isAllSelected(): boolean {
    return this.helpService.isSelectedAllFriends(this.selectedInviteFriends, this.currentLoadData)
  }
}
