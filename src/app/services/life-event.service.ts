import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root",
})
export class LifeEventService {
  constructor(private http: HttpClient) {}

  createLifeEvent(data) {
    return this.http.post("/api/createLifeEvent", data).map((res) => res);
  }

  getLifeEvent(id) {
    return this.http.get("/api/getLifeEvent/" + id).map((res) => res);
  }

  updateEvents(data) {
    return this.http.post("/api/updateEvents", data).map((res) => res);
  }

  checkEventStatusForUser(data) {
    return this.http
      .post("/api/checkEventStatusForUser", data)
      .map((res) => res);
  }

  deleteEvent(id) {
    return this.http.get("/api/deleteEvent/" + id).map((res) => res);
  }

  signInForEvent(data) {
    return this.http.post("/api/signInForEvent", data).map((res) => res);
  }

  searchOrganizator(data) {
    return this.http.post("/api/searchOrganizator", data).map((res) => res);
  }
}
