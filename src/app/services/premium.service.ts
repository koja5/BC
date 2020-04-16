import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root",
})
export class PremiumService {
  constructor(private http: HttpClient) {}

  sendFacture(data) {
    return this.http.post("/api/sendFacture", data).map((res) => res);
  }

  updatePaymentStatus(data) {
    return this.http.post("/api/updatePaymentStatus", data).map((res) => res);
  }
}
