import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root",
})
export class ConnectionService {
  constructor(private http: HttpClient) {}

  getMyOwnConnection(id) {
    return this.http.get("/api/getMyOwnConnection/" + id).map((res) => res);
  }

  getOtherConnections(id) {
    return this.http.get("/api/getOtherConnections/" + id).map((res) => res);
  }
}
