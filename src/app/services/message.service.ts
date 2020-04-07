import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public newFullname = new Subject<any>();

  constructor() { }

  sendNewFullname() {
    this.newFullname.next();
  }

  getNewFullname() {
    return this.newFullname.asObservable();
  }
}
