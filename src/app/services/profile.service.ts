import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getUserInfoSHA1(id) {
    return this.http.get('/api/getUserInfoSHA1/' + id).map(res => res);
  }
}
