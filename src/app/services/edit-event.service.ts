import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: 'root'
})
export class EditEventService {

  constructor(private http: HttpClient) { }

  createEventData(data) {
    return this.http.post("/api/createEventData", data).map((res) => res);
  }

  getEventData(id) {
    return this.http.get("/api/getEventData/" + id).map((res) => res);
  }

  updateEventData(data) {
    return this.http.post("/api/updateEventData", data).map((res) => res);
  }

  deleteEventData(id) {
    return this.http.get("/api/deleteEventData/" + id).map((res) => res);
  }

  searchOrganizator(data) {
    return this.http.post("/api/searchOrganizator", data).map((res) => res);
  }

  signInVirtualParticipant(data) {
    return this.http.post("/api/signInVirtualParticipant", data).map((res) => res);
  }

  signOutVirtualParticipant(data) {
    return this.http.post("/api/signOutVirtualParticipant", data).map((res) => res);
  }

  pushNewParticipant(data) {
    return this.http.post("/api/pushNewParticipant", data).map((res) => res);
  }

}
