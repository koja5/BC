import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root",
})
export class EditProfileService {
  constructor(private http: HttpClient) {}

  getUserInfoSHA1(id) {
    return this.http.get("/api/getUserInfoSHA1/" + id).map((res) => res);
  }

  editUser(data) {
    return this.http.post("/api/editUser", data).map((res) => res);
  }

  createExperience(data) {
    return this.http.post("/api/createExperience", data).map((res) => res);
  }

  getExperience(id) {
    return this.http.get("/api/getExperience/" + id).map((res) => res);
  }

  updateExperience(data) {
    return this.http.post("/api/updateExperience", data).map((res) => res);
  }

  deleteExperience(id) {
    return this.http.get("/api/deleteExperience/" + id).map((res) => res);
  }

  createEducation(data) {
    return this.http.post("/api/createEducation", data).map((res) => res);
  }

  getEducation(id) {
    return this.http.get("/api/getEducation/" + id).map((res) => res);
  }

  updateEducation(data) {
    return this.http.post("/api/updateEducation", data).map((res) => res);
  }

  deleteEducation(id) {
    return this.http.get("/api/deleteEducation/" + id).map((res) => res);
  }

  createLookingOffer(data) {
    return this.http.post("/api/createLookingOffer", data).map((res) => res);
  }

  getLookingOffer(id) {
    return this.http.get("/api/getLookingOffer/" + id).map((res) => res);
  }

  updateLookingOffer(data) {
    return this.http.post("/api/updateLookingOffer", data).map((res) => res);
  }

  deleteLookingOffer(id) {
    return this.http.get("/api/deleteLookingOffer/" + id).map((res) => res);
  }

  createAdditionalInfo(data) {
    return this.http.post("/api/createAdditionalInfo", data).map((res) => res);
  }

  getAdditionalInfo(id) {
    return this.http.get("/api/getAdditionalInfo/" + id).map((res) => res);
  }

  updateAdditionalInfo(data) {
    return this.http.post("/api/updateAdditionalInfo", data).map((res) => res);
  }

  deleteAdditionalInfo(id) {
    return this.http.get("/api/deleteAdditionalInfo/" + id).map((res) => res);
  }

  createBankAccount(data) {
    return this.http.post("/api/createBankAccount", data).map((res) => res);
  }

  getBankAccount(id) {
    return this.http.get("/api/getBankAccount/" + id).map((res) => res);
  }

  updateBankAccount(data) {
    return this.http.post("/api/updateBankAccount", data).map((res) => res);
  }

  deleteBankAccount(id) {
    return this.http.get("/api/deleteBankAccount/" + id).map((res) => res);
  }
}
