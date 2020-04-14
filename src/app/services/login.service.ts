import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/map";
import { CookieService } from "ng2-cookies";

@Injectable({
  providedIn: "root"
})
export class LoginService {
  public logged: boolean;

  constructor(public http: HttpClient, public cookie: CookieService) {}

  checkCountryLocation() {
    return this.http.get("http://ip-api.com/json").map(res => res);
  }

  getTranslationByCountryCode(code) {
    return this.http
      .get("/api/getTranslationByCountryCode/" + code)
      .map(res => res);
  }

  /*getDefaultLanguage() {
    return this.http
      .get("../../assets/configuration/language/english.json")
      .map(res => res);
  }*/

  getDefaultLanguage() {
    return this.http.get("/api/getTranslationByCountryCode/US").map(res => res);
  }

  login(data) {
    console.log(data);
    return this.http.post("/api/login", data).map(res => res);
  }

  signUp(data) {
    return this.http.post("/api/signup", data).map(res => res);
  }

  getUserInfo(id) {
    return this.http.get("/api/getUserInfo/" + id).map(res => res);
  }

  updateUserSID(data) {
    return this.http.post("/api/updateUserSID", data).map(res => res);
  }

  searchDirector(filter) {
    return this.http.post("/api/searchDirector", filter).map(res => res);
  }

  forgotPassword(data) {
    return this.http.post("/api/forgotPassword", data).map(res => res);
  }

  changePassword(data) {
    return this.http.post("/api/changePassword", data).map(res => res);
  }

  joinTo(data) {
    return this.http.post('/api/joinTo', data).map(res => res);
  }
}
