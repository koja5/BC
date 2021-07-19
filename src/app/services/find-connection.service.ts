import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { pipe } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FindConnectionService {

  constructor(private http: HttpClient) { }

  searchUser(filter) {
    return this.http.post("/api/searchUser", filter).pipe(map(res => res));
  }
}
