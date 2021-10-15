import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConnectionService } from 'src/app/services/connection.service';
import { PrepareMailService } from 'src/app/services/help-services/prepare-mail.service';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-virtual-event-invite-friend-dialog',
  templateUrl: './virtual-event-invite-friend-dialog.component.html',
  styleUrls: ['./virtual-event-invite-friend-dialog.component.scss']
})
export class VirtualEventInviteFriendDialogComponent implements OnInit {

  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  @Input() id: any;

  public language: any;
  public allMyConnection: any;
  public currentLoadData: any;
  public selectedInviteFriends = [];

  get isChecked(): boolean {
    return this.helpService.isSelectedAllFriends(this.selectedInviteFriends, this.currentLoadData);
  }

  constructor(private helpService: HelpService,
    private connectionService: ConnectionService,
    private prepareMail: PrepareMailService) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();


    this.connectionService
      .getAllMyConnections(localStorage.getItem("id"))
      .subscribe((data) => {
        this.allMyConnection = data;
        this.currentLoadData = data;
      });
  }

  public handleFilter(value): void {
    this.allMyConnection = this.currentLoadData.filter(
      (s) => s.fullname.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  public isItemSelected(itemText: string): boolean {
    return this.selectedInviteFriends.some((item) => item.id === itemText);
  }


  public selectAllMyFriends(): void {
    if (this.selectedInviteFriends.length !== this.currentLoadData.length) {
      this.selectedInviteFriends = this.currentLoadData;
    } else {
      this.selectedInviteFriends = [];
    }
  }

  public sendInviteForSelectedFriends(): void {
    this.prepareMail.sendInviteForSelectedFriends(
      this.language,
      this.selectedInviteFriends,
      this.id
    );
  }

}
