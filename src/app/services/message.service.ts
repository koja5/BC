import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public newUserInfo = new Subject<any>();

  constructor() { }

  sendNewUserInfo(info) {
    this.newUserInfo.next(info);
  }

  getNewUserInfo() {
    return this.newUserInfo.asObservable();
  }
}
