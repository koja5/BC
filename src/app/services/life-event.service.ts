import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { pipe } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LifeEventService {
  constructor(private http: HttpClient) { }

  checkEventStatusForUser(data) {
    return this.http
      .post("/api/checkEventStatusForUser", data)
      .pipe(map((res) => res));
  }

  signInForEvent(data) {
    return this.http.post("/api/signInForEvent", data).pipe(map((res) => res));
  }

  getSignInForLifeEvent(id) {
    return this.http.get("/api/getSignInForLifeEvent/" + id).pipe(map((res) => res));
  }
}
