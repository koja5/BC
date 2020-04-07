import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  constructor() { }

  getMyDirectorUser(id: number, sid: string) {
    const splitSid = sid.split('-');
    let i = 0;
    for(i; i < splitSid.length; i++) {
      if(splitSid[i] === id.toString()) {
        break;
      }
    }

    if(splitSid.length !== 0) {
      return splitSid[i - 1];
    } else {
      return null;
    }
  }
}
