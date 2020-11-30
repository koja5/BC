import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  HostListener,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as SimplePeer from "simple-peer";
import * as wrtc from "wrtc";
import { MitronPeer } from "src/app/models/room.model";
import { SignalMessage, RoomService } from "src/app/services/room.service";
import { EditEventService } from "src/app/services/edit-event.service";
import { HelpService } from "src/app/services/help.service";
declare var document: any;
import * as io from "socket.io-client";

@Component({
  selector: "app-room",
  templateUrl: "./room.component.html",
  styleUrls: ["./room.component.scss"],
})
export class RoomComponent implements OnInit {
  roomName: string;
  mitronPeers: Array<MitronPeer> = new Array();

  @ViewChild("myVideo")
  myVideo: ElementRef<HTMLVideoElement>;

  @ViewChildren("peerVideo")
  peerVideos: QueryList<ElementRef<HTMLVideoElement>>;
  public currentFilter: any;
  public currentPeer: any;
  public localStream: any;
  public microphoneStatus = "";
  public videoStatus = "";
  public chatStatus = "";
  public otherStream = [];
  public id: any;
  public windowLeaveMeeting = false;
  public language: any;
  public participantData: any;
  public chatMessage = "";
  public messages = [];
  public myIndex: number;
  private socket: SocketIOClient.Socket;
  public attendee: any;
  public showChat = true;
  @ViewChild("localVideo")
  localVideo: ElementRef<HTMLVideoElement>;
  private link =
    window.location.protocol +
    "//" +
    window.location.hostname +
    ":" +
    window.location.port;

  public configuration = {
    iceServers: [
      {
        urls: ["stun:eu-turn3.xirsys.com"],
      },
      {
        username:
          "SshzFbYDzE17qHmX58sSZrVQjS--IAIUdEq439QvsC0akVkxpJ0YuLkr5oUNXPD0AAAAAF-tBj5rb2ph",
        credential: "00ca4750-24cd-11eb-932a-0242ac140004",
        urls: [
          "turn:eu-turn3.xirsys.com:80?transport=udp",
          "turn:eu-turn3.xirsys.com:3478?transport=udp",
          "turn:eu-turn3.xirsys.com:80?transport=tcp",
          "turn:eu-turn3.xirsys.com:3478?transport=tcp",
          "turns:eu-turn3.xirsys.com:443?transport=tcp",
          "turns:eu-turn3.xirsys.com:5349?transport=tcp",
        ],
      },
    ],
  };

  public constraints = {
    audio: true,
    video: true,
  };
  public url =
    window.location.protocol +
    "//" +
    window.location.hostname +
    ":" +
    window.location.port;

  public peers = {};
  // public videos = document.getElementById("videos");
  @ViewChildren("videos")
  videos: QueryList<ElementRef<HTMLVideoElement>>;
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.checkRezolution();
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signalingService: RoomService,
    private editEventService: EditEventService,
    private helpService: HelpService
  ) {
    // this.socket = io();
    // this.socket = io.connect("http://localhost:3000");
    this.attendee = new SimplePeer();
    /*this.constraints.video["facingMode"] = {
      ideal: "user",
    };*/
  }

  ngOnInit(): void {
    // this.redirectIfNotHttps();
    this.id = this.route.snapshot.params.id;
    this.roomName = this.route.snapshot.params.id;
    this.language = JSON.parse(localStorage.getItem("language"));
    this.checkRezolution();
    this.getEventData(this.id);
    this.initializeMessage();
  }

  initializeMessage() {
    this.signalingService.connect();

    this.signalingService.onConnect(() => {
      console.log(`My Socket Id ${this.signalingService.socketId}`);

      this.signalingService.requestForJoiningRoom({
        roomName: this.id,
      });

      // receive message from chat
      this.signalingService.receiveMessage((data) => {
        console.log(data);
        this.messages.push(data);
      });
    });
  }

  redirectIfNotHttps() {
    // redirect if not https
    if (location.href.substr(0, 5) !== "https")
      location.href =
        "https" + location.href.substr(4, location.href.length - 4);
  }

  checkRezolution() {
    if (window.innerWidth < 768) {
      this.showChat = false;
      this.chatStatus = "turn-off";
    } else {
      this.showChat = true;
      this.chatStatus = '';
    }
  }

  initializeSpeakers() {
    // enabling the camera at startup

    navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then((stream) => {
        console.log("Received local stream");

        // this.localVideo.nativeElement.srcObject = stream;
        // stream.getAudioTracks()[0].enabled = false;
        // this.otherStream.push(stream);
        // this.myIndex = this.otherStream.length - 1;
        this.localStream = stream;
        this.mutedAudio();
        this.socket = io(this.url);
        // this.socket = io("http://localhost:3000");

        this.init();
      })
      .catch((e) => alert(`getusermedia error ${e.name}`));
  }

  mutedAudio() {
    setTimeout(() => {
      const muted = document.getElementById("local-video");
      muted.volume = 0;
    }, 200);
  }

  initilizePeersAsCaller(participants: Array<string>, stream: MediaStream) {
    const participantsExcludingMe = participants.filter(
      (id) => id != this.signalingService.socketId
    );
    this.mitronPeers = [];
    participantsExcludingMe.forEach((peerId) => {
      let peer: SimplePeer.Instance = new SimplePeer({
        initiator: true,
        stream: stream,
        config: this.configuration,
      });

      if (this.checkPeerId(peerId)) {
        this.mitronPeers.push({ peerId: peerId, peer: peer });
      }
      peer.on("signal", (signal) => {
        console.log(`${this.signalingService.socketId} Caller Block ${signal}`);
        this.signalingService.sendOfferSignal({
          signalData: signal,
          callerId: this.signalingService.socketId,
          calleeId: peerId,
        });
      });

      peer.on("stream", (stream) => {
        console.log(stream);
        this.createVideo(stream);
      });

      this.socket.on("getStartConnection", (payload) => {
        console.log(payload);
        if (peer) peer.destroy();
        peer = new SimplePeer({
          initiator: true,
          stream: stream,
        });
        peer.on("signal", (data) => {
          this.socket.emit("sendReceiveConnection", {
            signal: data,
            listenId: payload.listenId,
          });
        });
      });
      this.socket.on("signal", (data) => {
        peer.signal(data);
      });
    });
  }

  initilizePeersAsCallee(msg: SignalMessage, stream: MediaStream) {
    console.log(
      `${this.signalingService.socketId} You have an offer from ${msg.callerId}`
    );
    // this.signalingService.sendAnswerSignal({ signalData: msg.signalData, callerId: msg.callerId })

    const peer: SimplePeer.Instance = new SimplePeer({
      initiator: false,
      stream: stream,
      config: this.configuration,
    });

    peer.on("signal", (signal) => {
      console.log(`${this.signalingService.socketId} Callee Block ${signal}`);
      this.signalingService.sendAnswerSignal({
        signalData: signal,
        callerId: msg.callerId,
      });
    });

    const mitronPeer = this.mitronPeers.find(
      (mitronPeer) => mitronPeer.peerId === msg.callerId
    );
    if (mitronPeer.peer["_iceComplete"]) {
      mitronPeer.peer.signal(msg.signalData);
    }
  }

  initializeListeners(peerId) {
    console.log(peerId);

    this.attendee.on("signal", (data) => {
      this.socket.emit("signal", data);
      // attendee.signal(data.signal);
    });

    this.socket.on("getReceiveConnection", (data) => {
      console.log("getReceiveConnection");

      // Get remote video stream and display it
      this.attendee.on("stream", (stream) => {
        console.log(stream);
        // this.otherStream.push(stream);
        this.createVideo(stream);
      });
      this.attendee.signal(data.signal);
      /*setTimeout(() => {
        this.attendee.signal(data.signal);}, 250);*/
    });

    this.attendee.on("connect", function (conn) {});

    // Ask broadcaster to start his connection
    // for (let i = 0; i < this.participantData.speakers.length; i++) {
    this.socket.emit("startConnection", {
      listenId: peerId,
    });
    // }
  }

  getEventData(id) {
    this.editEventService.getEventData(id).subscribe((data) => {
      console.log(data);
      this.participantData = data;
      for (let i = 0; i < data["speakers"].length; i++) {
        if (
          this.helpService.convertToSHA(data["speakers"][i].id) ===
          localStorage.getItem("id")
        ) {
          this.initializeSpeakers();
          break;
        }
      }
      for (let i = 0; i < data["listeners"].length; i++) {
        if (
          this.helpService.convertToSHA(data["listeners"][i].id) ===
          localStorage.getItem("id")
        ) {
          this.initializeListeners(
            this.helpService.convertToSHA(data["listeners"][i].id)
          );
          break;
        }
      }
    });
  }

  createVideo(stream) {
    setTimeout(() => {
      if (this.checkCurrentStream(stream)) {
        this.otherStream.push(stream);
      }
      console.log(this.otherStream);
    }, 250);
  }

  checkCurrentStream(stream) {
    for (let i = 0; i < this.otherStream.length; i++) {
      if (this.otherStream[i].id === stream.id) {
        return false;
      }
    }
    return true;
  }

  createDiv() {
    let div = document.createElement("div");
    div.setAttribute("class", "centered");
    div.id = "muteText";
    div.innerHTML = "Click to Mute/Unmute";
    document.querySelector("#peerDiv").appendChild(div);
  }

  removeDiv() {
    if (
      document.getElementById("peerVideo") &&
      document.getElementById("muteText")
    ) {
      document.getElementById("peerVideo").remove();
      document.getElementById("muteText").remove();
    }
  }

  checkPeerId(peerId) {
    if (this.mitronPeers) {
      for (let i = 0; i < this.mitronPeers.length; i++) {
        if (this.mitronPeers[i].peerId === peerId) {
          return false;
        }
      }
      return true;
    }
    return true;
  }

  muteUnmute() {
    if (this.myVideo.nativeElement.muted) {
      this.myVideo.nativeElement.muted = false;
    } else {
      this.myVideo.nativeElement.muted = true;
    }
  }

  enableDisableMicrophone() {
    /*for (let index in this.otherStream[this.myIndex].getAudioTracks()) {
      this.otherStream[this.myIndex].getAudioTracks()[
        index
      ].enabled = !this.otherStream[this.myIndex].getAudioTracks()[index]
        .enabled;
    }*/
    for (let index in this.localStream.getAudioTracks()) {
      this.localStream.getAudioTracks()[
        index
      ].enabled = !this.localStream.getAudioTracks()[index].enabled;
    }
    if (this.microphoneStatus) {
      this.microphoneStatus = "";
    } else {
      this.microphoneStatus = "turn-off";
    }
  }

  enableDisableVideo() {
    /*for (let index in this.otherStream[this.myIndex].getVideoTracks()) {
      this.otherStream[this.myIndex].getVideoTracks()[
        index
      ].enabled = !this.otherStream[this.myIndex].getVideoTracks()[index]
        .enabled;
    }*/

    for (let index in this.localStream.getAudioTracks()) {
      this.localStream.getVideoTracks()[
        index
      ].enabled = !this.localStream.getVideoTracks()[index].enabled;
    }
    if (this.videoStatus) {
      this.videoStatus = "";
    } else {
      this.videoStatus = "turn-off";
    }
  }

  toggleFullscreen(): void {
    const isInFullScreen =
      (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement &&
        document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement &&
        document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null);

    const docElm = document.documentElement;
    if (!isInFullScreen) {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  sendFilter(participants, filter) {
    /*if (peer && filter) {
      peer.send(filter);
    }*/
    /*const mitronPeer = this.mitronPeers.find(
      (mitronPeer) => this.signalingService.socketId !== mitronPeer.peerId
    );*/
    /*const participantsExcludingMe = participants.filter(
      (id) => id === this.signalingService.socketId
    );
    participantsExcludingMe.peer.send(filter);*/
    if (this.currentPeer) {
      this.currentPeer.send(this.currentFilter);
    }
  }

  leaveMeetingAnswer(answer) {
    if (answer === "yes") {
      /*this.router.navigate([
        "home/main/event/virtual-event-details/" + this.id,
      ]);*/
      window.open("", "_self").close();
    }
    if (this.myIndex !== null && this.myIndex !== undefined) {
      this.otherStream[this.myIndex].getTracks().forEach(function (track) {
        track.stop();
      });
    }
    this.windowLeaveMeeting = false;
  }

  // send message on chat
  sendMessage() {
    const data = {
      roomId: this.id,
      senderId: JSON.parse(localStorage.getItem("user"))["fullname"],
      message: this.chatMessage,
    };

    this.chatMessage = "";

    this.signalingService.sendMessage(data);
  }

  CreateVideo(stream) {
    this.CreateDiv();

    let video = document.createElement("video");
    video.id = "peerVideo";
    video.srcObject = stream;
    video.setAttribute("class", "embed-responsive-item");
    document.querySelector("#peerDiv").appendChild(video);
    video.play();
    //wait for 1 sec

    video.addEventListener("click", () => {
      if (video.volume != 0) video.volume = 0;
      else video.volume = 1;
    });
  }

  CreateDiv() {
    let div = document.createElement("div");
    div.setAttribute("class", "centered");
    div.id = "muteText";
    div.innerHTML = "Click to Mute/Unmute";
    document.querySelector("#peerDiv").appendChild(div);
  }

  init() {
    this.socket.on("initReceive", (socket_id) => {
      console.log("INIT RECEIVE " + socket_id);
      this.addPeer(socket_id, false);
      this.socket.emit("initSend", socket_id);
    });

    this.socket.on("initSend1", (socket_id) => {
      console.log("INIT SEND " + socket_id);
      this.addPeer(socket_id, true);
    });

    this.socket.on("removePeer", (socket_id) => {
      console.log("removing peer " + socket_id);
      this.removePeer(socket_id);
    });

    /*this.socket.on("disconnect", () => {
      console.log("GOT DISCONNECTED");
      for (let socket_id in this.peers) {
        this.removePeer(socket_id);
      }
    });*/

    this.socket.on("signal", (data) => {
      this.peers[data.socket_id].signal(data.signal);
    });
  }

  addPeer(socket_id, am_initiator) {
    this.peers[socket_id] = new SimplePeer({
      initiator: am_initiator,
      stream: this.localStream,
      config: this.configuration,
    });
    console.log(this.peers);

    this.peers[socket_id].on("signal", (data) => {
      this.socket.emit("signal", {
        signal: data,
        socket_id: socket_id,
      });
    });

    this.peers[socket_id].on("stream", (stream) => {
      /*let newVid = document.createElement("video");
      newVid.srcObject = stream;
      newVid.id = socket_id;
      newVid.playsinline = false;
      newVid.autoplay = true;
      newVid.className = "vid";
      newVid.onclick = () => this.openPictureMode(newVid);
      newVid.ontouchstart = (e) => this.openPictureMode(newVid);*/
      // this.videos.first.nativeElement.childNodes[socket_id] = newVid;
      // document.getElementById('videos').appendChild = newVid;
      this.otherStream.push({ stream: stream, socket_id: socket_id });
      console.log(this.otherStream);
    });
  }

  removePeer(socket_id) {
    let videoEl = document.getElementById(socket_id);
    if (videoEl) {
      const tracks = videoEl.srcObject.getTracks();

      tracks.forEach(function (track) {
        track.stop();
      });

      videoEl.srcObject = null;
      videoEl.parentNode.removeChild(videoEl);
    }
    if (this.peers[socket_id]) {
      for (let i = 0; i < this.otherStream.length; i++) {
        if (this.otherStream[i].socket_id === socket_id) {
          const tracks = this.otherStream[i].stream.getTracks();
          tracks.forEach(function (track) {
            track.stop();
          });
          this.otherStream[i].stream = null;
          this.otherStream.splice(i, 1);
        }
      }
      this.peers[socket_id].destroy();
    }
    delete this.peers[socket_id];
  }

  openPictureMode(el) {
    console.log("opening pip");
    if (el.disablePictureInPicture) {
      el.requestPictureInPicture();
    }
  }

  showHideChat() {
    this.showChat = !this.showChat;
    if (this.chatStatus) {
      this.chatStatus = "";
    } else {
      this.chatStatus = "turn-off";
    }
  }
}
