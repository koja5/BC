import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { pipe } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FeedService {
  constructor(private http: HttpClient) { }

  getUserInfoSHA1(id) {
    return this.http.get("/api/getUserInfoSHA1/" + id).pipe(map((res) => res));
  }

  createPost(data) {
    return this.http.post("/api/createPost", data).pipe(map((res) => res));
  }

  getAllPostsForUser(id) {
    return this.http.get("/api/getAllPostsForUser/" + id).pipe(map((res) => res));
  }

  deletePost(id) {
    return this.http.get("/api/deletePost/" + id).pipe(map((res) => res));
  }

  likePost(data) {
    return this.http.post("/api/likePost", data).pipe(map((res) => res));
  }

  commentPost(data) {
    return this.http.post("/api/commentPost", data).pipe(map((res) => res));
  }

  getLikesForPost(id) {
    return this.http.get("/api/getLikesForPost/" + id).pipe(map((res) => res));
  }

  sendInviteFriend(data) {
    console.log(data);
    return this.http.post("/api/inviteFriend", data).pipe(map((res) => res));
  }

  getPeopleYouMightKnow() {
    return this.http.get("/api/getPeopleYouMightKnow").pipe(map((res) => res));
  }
}
