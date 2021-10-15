import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PrepareMailService } from 'src/app/services/help-services/prepare-mail.service';
import { HelpService } from 'src/app/services/help.service';
import { LifeEventService } from 'src/app/services/life-event.service';

@Component({
  selector: 'app-reminder-friends-dialog',
  templateUrl: './reminder-friends-dialog.component.html',
  styleUrls: ['./reminder-friends-dialog.component.scss']
})
export class ReminderFriendsDialogComponent implements OnInit {
  @Input() modal: NgbModalRef;
  @Input() modalSettings: any;
  @Input() id: any;
  public language;
  public allMyConnection: any;
  public currentLoadData: any;
  public selectedReminderFriends: any;

  constructor(private helpService: HelpService,
    private prepareMail: PrepareMailService,
    private lifeEventService: LifeEventService) { }

  ngOnInit() {
    this.language = this.helpService.getLanguage();

    this.lifeEventService.getSignInForLifeEvent(this.id).subscribe((data) => {
      console.log(data);
      if (data) {
        this.allMyConnection = data;
        this.currentLoadData = data;
        this.selectedReminderFriends = data;
      }
    });
  }

  handleFilter(value) {
    this.allMyConnection = this.currentLoadData.filter(
      (s) => s.fullname.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  isItemSelectedReminder(itemText: string): boolean {
    return this.selectedReminderFriends.some((item) => item.id === itemText);
  }


  selectAllMyReminderFriends() {
    if (this.selectedReminderFriends.length !== this.currentLoadData.length) {
      this.selectedReminderFriends = this.currentLoadData;
    } else {
      this.selectedReminderFriends = [];
    }
  }

  sendReminderForSelectedFriends() {
    this.prepareMail.sendReminderForSelectedFriends(
      this.language,
      this.selectedReminderFriends,
      this.id
    );
    this.modal.close();
  }

  get isAllSelected(): boolean {
    return this.helpService.isSelectedAllReminderFriends(this.selectedReminderFriends, this.currentLoadData)
  }
}
