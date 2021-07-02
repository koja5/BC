import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: 'root'
})
export class FindConnectionService {

  constructor(private http: HttpClient) { }

  searchUser(filter) {
    return this.http.post("/api/searchUser", filter).map(res => res);
  }
}
