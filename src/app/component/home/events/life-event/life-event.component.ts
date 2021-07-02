import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-life-event",
  templateUrl: "./life-event.component.html",
  styleUrls: ["./life-event.component.scss"],
})
export class LifeEventComponent implements OnInit {
  @Input() item: any;
  @Input() language: any;
  @Input() months: any;
  @Input() eventShareShowHide: any;
  @Output() eventShareEmitter = new EventEmitter<number>();
  @Output() copyLinkEmitter = new EventEmitter<any>();

  constructor(private router: Router) {}

  ngOnInit() {}

  shareEvent(id) {
    this.eventShareEmitter.emit(id);
  }

  copyLinkToClipboard(id) {
    const data = {
      type: "life",
      id: id
    };
    this.copyLinkEmitter.emit(data);
  }

  openEvent(id) {
    this.router.navigate(["/home/main/event/life-event-details/" + id]);
  }
}
