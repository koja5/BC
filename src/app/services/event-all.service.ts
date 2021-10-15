import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { pipe } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EventAllService {
  constructor(private http: HttpClient) { }

  getAllEvents(user) {
    return this.http.get("/api/getAllEvents/" + user).pipe(map((res) => res));
  }

  getMyEvents(id) {
    return this.http.get("/api/getMyEvents/" + id).pipe(map((res) => res));
  }

  getAllEventsByEventType(type) {
    return this.http
      .get("/api/getAllEventsByEventType/" + type)
      .pipe(map((res) => res));
  }
}
