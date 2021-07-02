import { Injectable } from "@angular/core";
import { HelpService } from "../help.service";
import { SetPackagesService } from "./set-packages.service";
import { MailService } from "../mail.service";
import { EditEventService } from "../edit-event.service";

@Injectable({
  providedIn: "root",
})
export class PrepareMailService {
  constructor(
    private helpService: HelpService,
    private setPackages: SetPackagesService,
    private mailService: MailService,
    private editEventService: EditEventService
  ) {}

  sendInviteForSelectedVirtualParticipant(
    type,
    language,
    id,
    selectedSpeakers,
    selectedListeners,
    allData
  ) {
    let customMessage = {};
    if (type === "speakers") {
      customMessage = {
        subject: language.inviteVirtualParticipantSpeakerForEventSubject,
        message: language.inviteVirtualParticipantSpeakerForEventMessage,
      };
    } else {
      customMessage = {
        subject: language.inviteVirtualParticipantListenerForEventSubject,
        message: language.inviteVirtualParticipantlistenerForEventMessage,
      };
    }
    const data = {
      inviter_id: localStorage.getItem("id"),
      inviter_fullname: JSON.parse(localStorage.getItem("user"))["fullname"],
      event_id: id,
      friends: this.helpService.packSelectedMemberToList(
        type === "speakers" ? selectedSpeakers : selectedListeners
      ),
      language: this.setPackages.packLanguageForVirtualParticipant(
        customMessage,
        language
      ),
    };

    if (data.friends) {
      this.mailService
        .sendInviteToVirtualParticipantForEvent(data)
        .subscribe((data) => {
          console.log(data);
        });

      this.helpService.sendMailSuccess();

      if (
        this.helpService.isInAList(
          type,
          allData,
          type === "speakers" ? selectedSpeakers : selectedListeners,
          "id"
        )
      ) {
        const data = {
          id: id,
          type: type,
          participant:
            type === "speakers" ? selectedSpeakers : selectedListeners,
        };

        this.editEventService.pushNewParticipant(data).subscribe((data) => {
          console.log(data);
        });
      }
    } else {
      this.helpService.createErrorMessage();
    }
  }

  sendReminderForSelectedFriends(language, selectedReminderFriends, id) {
    const data = {
      inviter_id: localStorage.getItem("id"),
      reminder_fullname: JSON.parse(localStorage.getItem("user"))["fullname"],
      event_id: id,
      friends: this.helpService.packSelectedMemberToList(
        selectedReminderFriends
      ),
      language: this.setPackages.packLanguageForReminder(language),
    };

    this.mailService.sendReminderForEvent(data).subscribe((data) => {
      console.log(data);
    });
    this.helpService.sendMailSuccess();
  }

  sendInviteForSelectedFriends(language, selectedInviteFriends, id) {
    const data = {
      inviter_id: localStorage.getItem("id"),
      inviter_fullname: JSON.parse(localStorage.getItem("user"))["fullname"],
      event_id: id,
      friends: this.helpService.packSelectedMemberToList(selectedInviteFriends),
      language: this.setPackages.packLanguageForInvite(language),
    };

    this.mailService.sendInviteForEvent(data).subscribe((data) => {
      console.log(data);
    });
    this.helpService.sendMailSuccess();
  }
}
