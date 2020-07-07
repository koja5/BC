import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class LifeEventDetailsService {
  constructor(private http: HttpClient) {}

  getLifeEventDetailsTemplate() {
    return this.http
      .get("../../assets/configuration/events/life-event-template.json")
      .map((res) => res);
  }
}
