import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { pipe } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CustomGridService {
  constructor(private http: HttpClient) { }

  deleteTranslation(id) {
    return this.http.get("/api/deleteTranslation/" + id).pipe(map((res) => res));
  }

  deleteMember(id) {
    return this.http.get("/api/deleteMember/" + id).pipe(map((res) => res));
  }

  updateMember(data) {
    return this.http.post("/api/updateMember", data).pipe(map((res) => res));
  }

  createMember(data) {
    return this.http.post("/api/createMember", data).pipe(map((res) => res));
  }

  getDirectors() {
    return this.http.get("/api/getDirectors").pipe(map((res) => res));
  }

  deleteEvent(id) {
    return this.http.get("/api/deleteEvent/" + id).pipe(map((res) => res));
  }
}
