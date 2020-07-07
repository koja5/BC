export class LifeEventModel {
  id_user?: string;
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
}
