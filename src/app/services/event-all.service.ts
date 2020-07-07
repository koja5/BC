import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root",
})
export class EventAllService {
  constructor(private http: HttpClient) {}

  getAllEvents(user) {
    return this.http.get("/api/getAllEvents/" + user).map((res) => res);
  }

  getMyEvents(id) {
    return this.http.get("/api/getMyEvents/" + id).map((res) => res);
  }

  getAllEventsByEventType(type) {
    return this.http
      .get("/api/getAllEventsByEventType/" + type)
      .map((res) => res);
  }
}
