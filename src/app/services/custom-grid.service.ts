import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root",
})
export class CustomGridService {
  constructor(private http: HttpClient) {}

  deleteTranslation(id) {
    return this.http.get("/api/deleteTranslation/" + id).map((res) => res);
  }

  deleteMember(id) {
    return this.http.get("/api/deleteMember/" + id).map((res) => res);
  }

  updateMember(data) {
    return this.http.post("/api/updateMember", data).map((res) => res);
  }

  createMember(data) {
    return this.http.post("/api/createMember", data).map((res) => res);
  }

  getDirectors() {
    return this.http.get("/api/getDirectors").map((res) => res);
  }

  deleteEvent(id) {
    return this.http.get("/api/deleteEvent/" + id).map((res) => res);
  }
}
