import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SetPackagesService {
  constructor() {}

  packLanguageForInvite(language) {
    return {
      inviteFriendsForEventRegardsFirst:
        language.inviteFriendsForEventRegardsFirst,
      inviteFriendsForEventMessage: language.inviteFriendsForEventMessage,
      inviteFriendsForEventShowEventDetails:
        language.inviteFriendsForEventShowEventDetails,
      inviteFriendsForEventThanksForUsing:
        language.inviteFriendsForEventThanksForUsing,
      inviteFriendsForEventHaveQuestion:
        language.inviteFriendsForEventHaveQuestion,
      inviteFriendsForEventGenerateMail:
        language.inviteFriendsForEventGenerateMail,
      inviteFriendsForEventCopyright: language.inviteFriendsForEventCopyright,
      inviteFriendsForEventSubject: language.inviteFriendsForEventSubject,
      inviteFriendsForEventInviteSend: language.inviteFriendsForEventInviteSend,
    };
  }

  packLanguageForVirtualParticipant(customMessage, language) {
    return {
      inviteVirtualParticipantForEventRegardsFirst:
        language.inviteVirtualParticipantForEventRegardsFirst,
      inviteVirtualParticipantForEventMessage: customMessage.message,
      inviteVirtualParticipantForEventShowEventDetails:
        language.inviteVirtualParticipantForEventShowEventDetails,
      inviteVirtualParticipantForEventThanksForUsing:
        language.inviteVirtualParticipantForEventThanksForUsing,
      inviteVirtualParticipantForEventHaveQuestion:
        language.inviteVirtualParticipantForEventHaveQuestion,
      inviteVirtualParticipantForEventGenerateMail:
        language.inviteVirtualParticipantForEventGenerateMail,
      inviteVirtualParticipantForEventCopyright:
        language.inviteVirtualParticipantForEventCopyright,
      inviteVirtualParticipantForEventSubject: customMessage.subject,
      inviteVirtualParticipantForEventInviteSend:
        language.inviteVirtualParticipantForEventInviteSend,
    };
  }

  packLanguageForReminder(language) {
    return {
      reminderFriendsForEventRegardsFirst:
        language.reminderFriendsForEventRegardsFirst,
      reminderFriendsForEventMessage: language.reminderFriendsForEventMessage,
      reminderFriendsForEventShowEventDetails:
        language.reminderFriendsForEventShowEventDetails,
      reminderFriendsForEventThanksForUsing:
        language.reminderFriendsForEventThanksForUsing,
      reminderFriendsForEventHaveQuestion:
        language.reminderFriendsForEventHaveQuestion,
      reminderFriendsForEventGenerateMail:
        language.reminderFriendsForEventGenerateMail,
      reminderFriendsForEventCopyright:
        language.reminderFriendsForEventCopyright,
      reminderFriendsForEventSubject: language.reminderFriendsForEventSubject,
      reminderFriendsForEventSend: language.reminderFriendsForEventSend,
    };
  }
}
