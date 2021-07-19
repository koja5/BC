import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { pipe } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ConnectionService {
  constructor(private http: HttpClient) { }

  getMyOwnConnection(id) {
    return this.http.get("/api/getMyOwnConnection/" + id).pipe(map((res) => res));
  }

  getOtherConnections(id) {
    return this.http.get("/api/getOtherConnections/" + id).pipe(map((res) => res));
  }

  getAllMyConnections(id) {
    return this.http.get("/api/getAllMyConnections/" + id).pipe(map((res) => res));
  }
}
