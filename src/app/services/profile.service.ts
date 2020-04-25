import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getUserInfoSHA1(id) {
    return this.http.get("/api/getUserInfoSHA1/" + id).map((res) => res);
  }

  uploadImage(data) {
    const data1 = {
      id: 1,
      img: data,
    };
    return this.http.post("/api/uploadImage", data1).map((res) => res);
  }

  getImage(name) {
    return this.http.get("../../assets/img/profile_image/" + name, {
      responseType: "blob",
    });
  }

  uploadImage1(data) {
    return this.http.post("/api/uploadImage1", data).map((res) => res);
  }
}
