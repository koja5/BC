import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map } from 'rxjs/operators';
import { CookieService } from "ng2-cookies";
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import languageCodes from 'src/app/data/languageCodes.json';

@Injectable({
  providedIn: "root",
})
export class LoginService {
  public logged: boolean;

  constructor(public http: HttpClient, public cookie: CookieService) { }

  checkCountryLocation(): Observable<any> {
    return this.http
      .get("http://ip-api.com/json")
      .pipe(
        catchError((error: Response) => {
          return throwError(error);
        })
      );
  }

  // Search by ISO 639-1 language code.
  checkLanguageCode(languageCode: string): boolean {
    return languageCodes.filter((lang) => lang.code === languageCode).length > 0;
  }

  getTranslationByLanguageCode(code: string) {
    return this.http
      .get("/api/getTranslationByLanguageCode/" + code)
      .pipe(map((res) => res));

  }

  /*getDefaultLanguage() {
    return this.http
      .get("../../assets/configuration/language/english.json")
      .map(res => res);
  }*/

  getDefaultLanguage() {
    return this.http
      .get("/api/getTranslationByLanguageCode/en")
      .pipe(map((res) => res));
  }

  login(data) {
    console.log(data);
    return this.http.post("/api/login", data).pipe(map((res) => res));
  }

  signUp(data) {
    return this.http.post("/api/signup", data).pipe(map((res) => res));
  }

  getUserInfo(id) {
    return this.http.get("/api/getUserInfo/" + id).pipe(map((res) => res));
  }

  updateUserSID(data) {
    return this.http.post("/api/updateUserSID", data).pipe(map((res) => res));
  }

  searchDirector(filter) {
    return this.http.post("/api/searchDirector", filter).pipe(map((res) => res));
  }

  forgotPassword(data) {
    return this.http.post("/api/forgotPassword", data).pipe(map((res) => res));
  }

  changePassword(data) {
    return this.http.post("/api/changePassword", data).pipe(map((res) => res));
  }

  joinTo(data) {
    return this.http.post("/api/joinTo", data).pipe(map((res) => res));
  }

  joinToFromReferral(data) {
    return this.http.post("/api/joinToFromReferral", data).pipe(map((res) => res));
  }
}
