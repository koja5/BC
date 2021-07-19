import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: "root",
})
export class EventService {
  constructor(private http: HttpClient) { }

  createEvent(data) {
    return this.http.post("/api/createEvent", data).pipe(map((res) => res));
  }

  getEvents() {
    return this.http.get("/api/getEvents").pipe(map((res) => res));
  }

  getEventByName(name) {
    return this.http.get("/api/getEventById/" + name).pipe(map((res) => res));
  }

  updateEvent(data) {
    return this.http.post("/api/updateEvent", data).pipe(map((res) => res));
  }
}
