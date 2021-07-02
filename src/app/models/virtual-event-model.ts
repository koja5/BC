export class VirtualEventModel {
  id_user?: any;
  nameEvent?: string;
  date?: Date;
  time?: Date;
  event?: string;
  comment?: string;
  organizer?: string;
  numberOfSpeakers?: string;
  numberOfListeners?: string;
  eventType?: number;
  speakers: any[] = [];
  speakersConfirm: any[] = [];
  listeners: any[] = [];
  listenersConfirm: any[] = [];
  life?: boolean;
  chargeable?: boolean;
  price?: number;
}
