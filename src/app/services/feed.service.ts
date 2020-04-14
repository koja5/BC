import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root",
})
export class FeedService {
  constructor(private http: HttpClient) {}

  getUserInfoSHA1(id) {
    return this.http.get("/api/getUserInfoSHA1/" + id).map((res) => res);
  }

  createPost(data) {
    return this.http.post("/api/createPost", data).map((res) => res);
  }

  getAllPostsForUser(id) {
    return this.http.get("/api/getAllPostsForUser/" + id).map((res) => res);
  }

  deletePost(id) {
    return this.http.get("/api/deletePost/" + id).map((res) => res);
  }

  likePost(data) {
    return this.http.post("/api/likePost", data).map((res) => res);
  }

  commentPost(data) {
    return this.http.post("/api/commentPost", data).map((res) => res);
  }

  getLikesForPost(id) {
    return this.http.get("/api/getLikesForPost/" + id).map((res) => res);
  }

  sendInviteFriend(data) {
    console.log(data);
    return this.http.post("/api/inviteFriend", data).map((res) => res);
  }

  getPeopleYouMightKnow() {
    return this.http.get("/api/getPeopleYouMightKnow").map((res) => res);
  }
}
