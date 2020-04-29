import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class MessageChatService {
  constructor(private http: HttpClient) {}

  private socket = io("http://localhost:3000");

  joinRoom(data) {
    this.socket.emit("join", data);
  }

  newUserJoined() {
    let observable = new Observable<{
      date: String;
      message: String;
      sender_id: String;
    }>((observer) => {
      this.socket.on("new user joined", (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });

    return observable;
  }

  leaveRoom(data) {
    this.socket.emit("leave", data);
  }

  userLeftRoom() {
    let observable = new Observable<{
      date: String;
      message: String;
      sender_id: String;
    }>((observer) => {
      this.socket.on("left room", (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });

    return observable;
  }

  sendMessage(data) {
    console.log(data);
    this.socket.emit("message", data);
  }

  newMessageReceived() {
    let observable = new Observable<{
      sender_id: String;
      message: String;
      fullname: String;
      image: String;
      date: String;
    }>((observer) => {
      this.socket.on("new message", (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });

    return observable;
  }

  createMessage(data) {
    return this.http.post("/api/createMessage", data).map((res) => res);
  }

  getAllMessagesForUser(id) {
    return this.http.get("/api/getAllMessagesForUser/" + id).map((res) => res);
  }

  getMessageForSelectedUser(id) {
    return this.http
      .get("/api/getMessageForSelectedUser/" + id)
      .map((res) => res);
  }

  getOrCreate(data) {
    return this.http.post("/api/getOrCreate", data).map((res) => res);
  }

  pushNewMessage(data) {
    this.socket.emit('new message', { username: "john" });
    return this.http.post("/api/pushNewMessage", data).map((res) => res);
  }


}
