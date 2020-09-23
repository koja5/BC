import {
    Component,
    OnInit,
    ViewChild,
    ViewChildren,
    ElementRef,
    QueryList,
  } from "@angular/core";
  import { ActivatedRoute, Router } from "@angular/router";
  import * as SimplePeer from "simple-peer";
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
    public otherStream = [];
    public id: any;
    public windowLeaveMeeting = false;
    public language: any;
    public participantData: any;
    public chatMessage = "";
    public messages = [];
    public myIndex: number;
    private socket: SocketIOClient.Socket;
    public attendee = new SimplePeer();
    private link =
      window.location.protocol +
      "//" +
      window.location.hostname +
      ":" +
      window.location.port;
  
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private signalingService: RoomService,
      private editEventService: EditEventService,
      private helpService: HelpService
    ) {
      // this.socket = io.connect(this.link);
      this.socket = io.connect("http://localhost:3000");
    }
  
    ngOnInit(): void {
      this.id = this.route.snapshot.params.id;
      this.language = JSON.parse(localStorage.getItem("language"));
      this.signalingService.connect();
      this.getEventData(this.id);
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
  
      /*navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          console.log(stream);
          this.myVideo.nativeElement.srcObject = stream;
          this.myVideo.nativeElement.play();
          this.myVideo.nativeElement.muted = true;
          this.localStream = stream;
  
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
  
            this.signalingService.onRoomParticipants((participants) => {
              console.log(
                `${this.signalingService.socketId} - On Room Participants`
              );
              console.log(participants);
  
              this.initilizePeersAsCaller(participants, stream);
            });
  
            this.signalingService.onOffer((msg) => {
              this.initilizePeersAsCallee(msg, stream);
            });
  
            this.signalingService.onAnswer((msg) => {
              console.log(
                `${this.signalingService.socketId} - You got Answer from ${msg.calleeId}`
              );
              const mitronPeer = this.mitronPeers.find(
                (mitronPeer) => mitronPeer.peerId === msg.calleeId
              );
              mitronPeer.peer.signal(msg.signalData);
            });
  
            this.signalingService.onRoomLeft((socketId) => {
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });*/
    }
  
    initializeSpeakers() {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          this.otherStream.push(stream);
          this.myIndex = this.otherStream.length - 1;
          this.gotMedia(stream);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  
    initializeListeners(peerId) {
      console.log(peerId);
  
      this.attendee.on("signal", (data) => {
        setTimeout(() => {
          this.socket.emit("signal", data);
          // attendee.signal(data.signal);
        }, 200);
      });
  
      this.socket.on("signal", (data) => {
        this.attendee.signal(data.signal);
        setTimeout(() => {}, 250);
      });
  
      this.attendee.on("connect", function (conn) {});
  
      // Get remote video stream and display it
      this.attendee.on("stream", (stream) => {
        console.log(stream);
        this.otherStream.push(stream);
        // this.createVideo(stream);
      });
  
      // Ask broadcaster to start his connection
      // for (let i = 0; i < this.participantData.speakers.length; i++) {
      setTimeout(() => {
        this.socket.emit("startConnection", {
          listenId: peerId,
        });
      }, 100);
      // }
    }
  
    // ovde moras da saljes svima osim sebiii!!!
    gotMedia = (stream) => {
      let broadcaster = new SimplePeer({ initiator: true, stream: stream });
      broadcaster.on("signal", (data) => {
        this.socket.emit("signal", data);
      });
  
      broadcaster.on("stream", (stream) => {
        console.log(stream);
        this.otherStream.push(stream);
      });
      // destroy current peerconnection and create a new one
      this.socket.on("startConnection", (payload) => {
        console.log(payload);
        if (broadcaster) broadcaster.destroy();
        broadcaster = new SimplePeer({
          initiator: true,
          stream: stream,
        });
        broadcaster.on("signal", (data) => {
          this.socket.emit("signal", {
            signal: data,
            listenId: payload.listenId,
          });
        });
      });
      this.socket.on("signal", (data) => {
        broadcaster.signal(data);
      });
    };
  
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
  
    initilizePeersAsCaller(participants: Array<string>, stream: MediaStream) {
      const participantsExcludingMe = participants.filter(
        (id) => id != this.signalingService.socketId
      );
      this.mitronPeers = [];
      participantsExcludingMe.forEach((peerId) => {
        const peer: SimplePeer.Instance = new SimplePeer({
          initiator: true,
          trickle: false,
          stream,
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
      });
    }
  
    initilizePeersAsCallee(msg: SignalMessage, stream: MediaStream) {
      console.log(
        `${this.signalingService.socketId} You have an offer from ${msg.callerId}`
      );
  
      const peer: SimplePeer.Instance = new SimplePeer({
        initiator: false,
        trickle: false,
        stream,
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
      mitronPeer.peer.signal(msg.signalData);
    }
  
    createVideo(stream) {
      setTimeout(() => {
        if (this.checkCurrentStream(stream)) {
          this.otherStream.push(stream);
        }
        console.log(this.otherStream);
      }, 100);
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
      for (let index in this.otherStream[this.myIndex].getAudioTracks()) {
        this.otherStream[this.myIndex].getAudioTracks()[
          index
        ].enabled = !this.otherStream[this.myIndex].getAudioTracks()[index]
          .enabled;
      }
      if (this.microphoneStatus) {
        this.microphoneStatus = "";
      } else {
        this.microphoneStatus = "turn-off";
      }
    }
  
    enableDisableVideo() {
      for (let index in this.otherStream[this.myIndex].getVideoTracks()) {
        this.otherStream[this.myIndex].getVideoTracks()[
          index
        ].enabled = !this.otherStream[this.myIndex].getVideoTracks()[index]
          .enabled;
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
        this.router.navigate([
          "home/main/event/virtual-event-details/" + this.id,
        ]);
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
  }
  