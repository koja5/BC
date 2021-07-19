import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { pipe } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(private http: HttpClient) { }

  getUserInfoSHA1(id) {
    return this.http.get("/api/getUserInfoSHA1/" + id).pipe(pipe(map((res) => res)));
  }

  uploadImage(data) {
    const data1 = {
      id: 1,
      img: data,
    };
    return this.http.post("/api/uploadImage", data1).pipe(pipe(map((res) => res)));
  }

  getImage(name) {
    return this.http.get("../../assets/img/profile_image/" + name, {
      responseType: "blob",
    });
  }

  uploadImage1(data) {
    return this.http.post("/api/uploadImage1", data).pipe(pipe(map((res) => res)));
  }

  getRecommendation(id) {
    return this.http.get("/api/getRecommendation/" + id).pipe(pipe(map((res) => res)));
  }
}
