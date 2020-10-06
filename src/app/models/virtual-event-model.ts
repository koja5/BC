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
  spikers?: any[] = [];
  listeners?: any[] = [];
  life?: boolean;
  chargeable?: boolean;
  price?: number;
}
