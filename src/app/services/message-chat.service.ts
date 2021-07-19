import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MessageChatService {
  public url = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
  // public url = "http://localhost:3000";

  constructor(private http: HttpClient) { }

  // private socket = io.connect(this.url);
  private socket = io(this.url);

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
    this.socket.emit("message", data);
  }

  newMessageReceived() {
    let observable = new Observable<{
      sender_id: String;
      message: String;
      fullname: String;
      image: String;
      date: String;
      not_seen: String;
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

  getNotification() {
    let observable = new Observable<{
      text: String;
    }>((observer) => {
      this.socket.on("notification", (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });

    return observable;
  }

  createMessage(data) {
    return this.http.post("/api/createMessage", data).pipe(map((res) => res));
  }

  getAllMessagesForUser(id) {
    return this.http.get("/api/getAllMessagesForUser/" + id).pipe(map((res) => res));
  }

  getMessageForSelectedUser(id) {
    return this.http
      .get("/api/getMessageForSelectedUser/" + id)
      .pipe(map((res) => res));
  }

  getOrCreate(data) {
    return this.http.post("/api/getOrCreate", data).pipe(map((res) => res));
  }

  pushNewMessage(data) {
    this.socket.emit("new message", { username: "john" });
    return this.http.post("/api/pushNewMessage", data).pipe(map((res) => res));
  }

  updateSeen(data) {
    return this.http.post("/api/updateSeen", data).pipe(map((res) => res));
  }
}
