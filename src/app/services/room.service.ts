import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { SignalData } from "simple-peer";

@Injectable({
  providedIn: "root",
})
export class RoomService {
  private socket: SocketIOClient.Socket;
  private link =
    window.location.protocol +
    "//" +
    window.location.hostname +
    ":" +
    window.location.port;

  get socketId() {
    return this.socket.id;
  }

  constructor() {
    // this.socket = io.connect(this.link);
    this.socket = io.connect("http://localhost:3000");
  }

  connect() {
    // this.socket = io.connect(this.link);
    this.socket = io.connect("http://localhost:3000");
  }

  private listen(channel: string, fn: Function) {
    this.socket.on(channel, fn);
  }

  private send(chanel: string, message: SignalMessage) {
    this.socket.emit(chanel, message);
  }

  private sendGlobal(chanel: string, message: any) {
    this.socket.emit(chanel, message);
  }

  private listenGlobal(channel: string, data: any) {
    this.socket.on(channel, data);
  }

  onConnect(fn: () => void) {
    this.listen("connect", fn);
  }

  requestForJoiningRoom(msg: SignalMessage) {
    this.send("room_join_request", msg);
  }

  requestForJoiningRoomBroadcast(msg: SignalMessage) {
    this.send("room_join_request_broadcast", msg);
  }

  onRoomParticipants(fn: (participants: Array<string>) => void) {
    this.listen("room_users", fn);
  }

  sendOfferSignal(msg: SignalMessage) {
    this.send("offer_signal", msg);
  }

  onOffer(fn: (msg: SignalMessage) => void) {
    this.listen("offer", fn);
  }

  sendAnswerSignal(msg: SignalMessage) {
    this.send("answer_signal", msg);
  }

  onAnswer(fn: (msg: SignalMessage) => void) {
    this.listen("answer", fn);
  }

  onRoomLeft(fn: (socketId: string) => void) {
    this.listen("room_left", fn);
  }

  firstUserOn(fn: (userId: string) => void) {
    this.listen("first_user", fn);
  }

  listenUser(fn: (participants: Array<string>) => void) {
    this.listen("listen_user", fn);
  }

  callFirstUser(msg: SignalMessage) {
    this.send("callFirstUser", msg);
  }

  listenerUserOn(fn: (msg: SignalMessage) => void) {
    this.listen("listenerUserOn", fn);
  }

  sendMessage(data: ChatMessage) {
    this.sendGlobal("send_message", data);
  }

  receiveMessage(data: any) {
    console.log(data);
    this.listenGlobal("receive_message", data);
  }
}

export interface SignalMessage {
  callerId?: string;
  calleeId?: string;
  signalData?: SignalData;
  msg?: string;
  roomName?: string;
  stream?: MediaStream;
}

export interface ChatMessage {
  roomId?: string;
  senderId?: string;
  message?: string;
}
