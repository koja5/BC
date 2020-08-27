import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root",
})
export class LifeEventService {
  constructor(private http: HttpClient) {}

  checkEventStatusForUser(data) {
    return this.http
      .post("/api/checkEventStatusForUser", data)
      .map((res) => res);
  }

  signInForEvent(data) {
    return this.http.post("/api/signInForEvent", data).map((res) => res);
  }

  sendInviteForEvent(data) {
    return this.http.post("/api/sendInviteForEvent", data).map((res) => res);
  }

  sendReminderForEvent(data) {
    return this.http.post("/api/sendReminderForEvent", data).map((res) => res);
  }

  getSignInForLifeEvent(id) {
    return this.http.get("/api/getSignInForLifeEvent/" + id).map((res) => res);
  }
}
