import { PrepareMailService } from './../../../services/help-services/prepare-mail.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConnectionService } from 'src/app/services/connection.service';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-invite-virtual-participant-dialog',
  templateUrl: './invite-virtual-participant-dialog.component.html',
  styleUrls: ['./invite-virtual-participant-dialog.component.scss']
})
export class InviteVirtualParticipantDialogComponent implements OnInit {
  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  @Input() id: any;
  @Input() data: any;
  public language;
  public inviteVirtualParticipantWindow = false;
  public inviteVirtualParticipantWindowMessage: any;
  public typeOfVirtualParticipant = "speakers";
  public allMyConnection: any;
  public currentLoadData: any;
  public selectedSpeakers: any;
  public selectedListeners: any;

  constructor(private helpService: HelpService,
    private connectionService: ConnectionService,
    private prepareMailService: PrepareMailService,

  ) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();

    if (this.typeOfVirtualParticipant === "speakers") {
      this.inviteVirtualParticipantWindowMessage = this.language.inviteVirtualParticipantSpeakerForEventMessage;
    } else {
      this.inviteVirtualParticipantWindowMessage = this.language.inviteVirtualParticipantListenerForEventMessage;
    }
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

  sendInviteForSelectedVirtualParticipant(type) {
    this.prepareMailService.sendInviteForSelectedVirtualParticipant(
      type,
      this.language,
      this.id,
      this.selectedSpeakers,
      this.selectedListeners,
      this.data
    );
    this.modal.close();
  }

}
