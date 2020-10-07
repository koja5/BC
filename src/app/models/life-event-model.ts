export class LifeEventModel {
  id_user?: any;
  nameEvent?: string;
  date?: Date;
  time?: Date;
  event?: string;
  comment?: string;
  organizer?: string;
  attendees?: string;
  eventType?: number;
  nameOfLocation?: string;
  location?: string;
  zip?: string;
  street?: string;
  signIn?: any[];
  online?: boolean;
  numberOfSpeakers?: number;
  numberOfListeners?: number;
  speakers: any[] = [];
  listeners: any[] = [];
  chargeable?: boolean;
  price?: number;
}
