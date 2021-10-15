import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PremiumService {
  constructor(private http: HttpClient) { }

  sendFacture(data) {
    return this.http.post("/api/sendFacture", data).pipe(map((res) => res));
  }

  updatePaymentStatus(data) {
    return this.http.post("/api/updatePaymentStatus", data).pipe(map((res) => res));
  }
}
