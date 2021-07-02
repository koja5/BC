import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root",
})
export class EventService {
  constructor(private http: HttpClient) {}

  createEvent(data) {
    return this.http.post("/api/createEvent", data).map((res) => res);
  }

  getEvents() {
    return this.http.get("/api/getEvents").map((res) => res);
  }

  getEventByName(name) {
    return this.http.get("/api/getEventById/" + name).map((res) => res);
  }

  updateEvent(data) {
    return this.http.post("/api/updateEvent", data).map((res) => res);
  }
}
