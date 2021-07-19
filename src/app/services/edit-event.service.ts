import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { pipe } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EditEventService {

  constructor(private http: HttpClient) { }

  createEventData(data) {
    return this.http.post("/api/createEventData", data).pipe(map((res) => res));
  }

  getEventData(id) {
    return this.http.get("/api/getEventData/" + id).pipe(map((res) => res));
  }

  updateEventData(data) {
    return this.http.post("/api/updateEventData", data).pipe(map((res) => res));
  }

  deleteEventData(id) {
    return this.http.get("/api/deleteEventData/" + id).pipe(map((res) => res));
  }

  searchOrganizator(data) {
    return this.http.post("/api/searchOrganizator", data).pipe(map((res) => res));
  }

  signInVirtualParticipant(data) {
    return this.http.post("/api/signInVirtualParticipant", data).pipe(map((res) => res));
  }

  signOutVirtualParticipant(data) {
    return this.http.post("/api/signOutVirtualParticipant", data).pipe(map((res) => res));
  }

  pushNewParticipant(data) {
    return this.http.post("/api/pushNewParticipant", data).pipe(map((res) => res));
  }

}
