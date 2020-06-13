import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  public newFullname = new Subject<any>();
  public userInfo = new Subject<null>();
  public navigationItemFeed = new Subject<null>();

  constructor() {}

  sendNewFullname() {
    this.newFullname.next();
  }

  getNewFullname() {
    return this.newFullname.asObservable();
  }

  sendUserInfo() {
    this.userInfo.next();
  }

  getUserInfo() {
    return this.userInfo.asObservable();
  }

  sendNavigationItemFeed() {
    this.navigationItemFeed.next();
  }

  getNavigationItemFeed() {
    return this.navigationItemFeed.asObservable();
  }
}
