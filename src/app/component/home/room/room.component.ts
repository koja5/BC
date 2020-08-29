import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: "app-room",
  templateUrl: "./room.component.html",
  styleUrls: ["./room.component.scss"],
})
export class RoomComponent implements OnInit {
  @ViewChild("myVideo")
  myVideo: ElementRef<HTMLVideoElement>;

  public id: any;
  public windowLeaveMeeting = false;
  public language: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.language = JSON.parse(localStorage.getItem("language"));
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log(stream);
        this.myVideo.nativeElement.srcObject = stream;
        this.myVideo.nativeElement.play();
        this.myVideo.nativeElement.muted = true;
      });
  }

  leaveMeetingAnswer(answer) {
    if(answer === 'yes') {
      this.router.navigate(['home/main/event/virtual-event-details/' + this.id]);
    }
    this.windowLeaveMeeting = false;
  }
}
