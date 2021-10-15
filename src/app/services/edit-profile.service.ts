import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { pipe } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EditProfileService {
  constructor(private http: HttpClient) { }

  getUserInfoSHA1(id) {
    return this.http.get("/api/getUserInfoSHA1/" + id).pipe(map((res) => res));
  }

  editUser(data) {
    return this.http.post("/api/editUser", data).pipe(map((res) => res));
  }

  createExperience(data) {
    return this.http.post("/api/createExperience", data).pipe(map((res) => res));
  }

  getExperience(id) {
    return this.http.get("/api/getExperience/" + id).pipe(map((res) => res));
  }

  updateExperience(data) {
    return this.http.post("/api/updateExperience", data).pipe(map((res) => res));
  }

  deleteExperience(id) {
    return this.http.get("/api/deleteExperience/" + id).pipe(map((res) => res));
  }

  createEducation(data) {
    return this.http.post("/api/createEducation", data).pipe(map((res) => res));
  }

  getEducation(id) {
    return this.http.get("/api/getEducation/" + id).pipe(map((res) => res));
  }

  updateEducation(data) {
    return this.http.post("/api/updateEducation", data).pipe(map((res) => res));
  }

  deleteEducation(id) {
    return this.http.get("/api/deleteEducation/" + id).pipe(map((res) => res));
  }

  createLookingOffer(data) {
    return this.http.post("/api/createLookingOffer", data).pipe(map((res) => res));
  }

  getLookingOffer(id) {
    return this.http.get("/api/getLookingOffer/" + id).pipe(map((res) => res));
  }

  updateLookingOffer(data) {
    return this.http.post("/api/updateLookingOffer", data).pipe(map((res) => res));
  }

  deleteLookingOffer(id) {
    return this.http.get("/api/deleteLookingOffer/" + id).pipe(map((res) => res));
  }

  createAdditionalInfo(data) {
    return this.http.post("/api/createAdditionalInfo", data).pipe(map((res) => res));
  }

  getAdditionalInfo(id) {
    return this.http.get("/api/getAdditionalInfo/" + id).pipe(map((res) => res));
  }

  updateAdditionalInfo(data) {
    return this.http.post("/api/updateAdditionalInfo", data).pipe(map((res) => res));
  }

  deleteAdditionalInfo(id) {
    return this.http.get("/api/deleteAdditionalInfo/" + id).pipe(map((res) => res));
  }

  createBankAccount(data) {
    return this.http.post("/api/createBankAccount", data).pipe(map((res) => res));
  }

  getBankAccount(id) {
    return this.http.get("/api/getBankAccount/" + id).pipe(map((res) => res));
  }

  updateBankAccount(data) {
    return this.http.post("/api/updateBankAccount", data).pipe(map((res) => res));
  }

  deleteBankAccount(id) {
    return this.http.get("/api/deleteBankAccount/" + id).pipe(map((res) => res));
  }

  updatePassword(data) {
    return this.http.post("/api/updatePassword", data).pipe(map((res) => res));
  }
}
