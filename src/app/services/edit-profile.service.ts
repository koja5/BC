import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root"
})
export class EditProfileService {
  constructor(private http: HttpClient) {}

  getUserInfoSHA1(id) {
    return this.http.get("/api/getUserInfoSHA1/" + id).map(res => res);
  }

  editUser(data) {
    return this.http.post("/api/editUser", data).map(res => res);
  }
}
