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
    public arrayPeers = [];
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
      this.socket.on("getAnswerToInitial", (data) => {
        const mitronPeer = this.arrayPeers.find(
          (mitronPeer) => mitronPeer.peerId === data.from
        );
        mitronPeer.peer.signal(data.signal);
      });
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
            this.signalingService.onRoomParticipants((participants) => {
              console.log(
                `${this.signalingService.socketId} - On Room Participants`
              );
              console.log(participants);
  
              this.initializeSpeakers(participants);
            });
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
  
    initializeSpeakers(participants) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          this.otherStream.push(stream);
          this.myIndex = this.otherStream.length - 1;
          this.gotMedia(participants, stream);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  
    // ovde moras da saljes svima osim sebiii!!!
    gotMedia = (participants, stream) => {
      const participantsExcludingMe = participants.filter(
        (id) => id != this.signalingService.socketId
      );
      participantsExcludingMe.forEach((peerId) => {
        let broadcaster = new SimplePeer({ initiator: true, stream: stream });
        broadcaster.on("signal", (data) => {
          this.socket.emit("sendInitialSignal", {
            signal: data,
            from: this.signalingService.socketId,
            to: peerId,
          });
        });
  
        if (this.checkPeerId(peerId)) {
          this.arrayPeers.push({
            peerId: peerId,
            peer: broadcaster,
          });
        }
  
        broadcaster.on("stream", (stream) => {
          console.log(stream);
          this.otherStream.push(stream);
        });
        // destroy current peerconnection and create a new one
        this.socket.on("sendEventToSpeakers", (payload) => {
          console.log(payload);
          if (broadcaster) broadcaster.destroy();
          broadcaster = new SimplePeer({
            initiator: true,
            stream: stream,
          });
          broadcaster.on("signal", (data) => {
            this.socket.emit("sendEventToListeners", {
              signal: data,
              from: this.signalingService.socketId,
              to: data.from,
            });
          });
        });
      });
    };
  
    initializeListeners(peerId) {
      console.log(peerId);
      this.socket.on("getInitialSignal", (initial) => {
        this.attendee.on("signal", (data) => {
          this.socket.emit("sendAnswerToInitial", {
            signal: data.signal,
            from: this.signalingService.socketId,
            to: initial.from,
          });
        });
      });
  
      this.socket.on("getEventFromSpeakers", (data) => {
        this.attendee.signal(data.signal);
      });
  
      this.attendee.on("connect", function (conn) {});
  
      // Get remote video stream and display it
      this.attendee.on("stream", (stream) => {
        console.log(stream);
        this.otherStream.push(stream);
        // this.createVideo(stream);
      });
  
      // Ask broadcaster to start his connection
      setTimeout(() => {
        this.socket.emit("startConnection", {
          roomName: this.id,
          from: this.signalingService.socketId,
        });
      }, 100);
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
  
    checkPeerId(peerId) {
      if (this.mitronPeers) {
        for (let i = 0; i < this.arrayPeers.length; i++) {
          if (this.arrayPeers[i].peerId === peerId) {
            return false;
          }
        }
        return true;
      }
      return true;
    }
  }
  