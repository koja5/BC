import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-virtual-event",
  templateUrl: "./virtual-event.component.html",
  styleUrls: ["./virtual-event.component.scss"],
})
export class VirtualEventComponent implements OnInit {
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
      type: "virtual",
      id: id
    };
    this.copyLinkEmitter.emit(data);
  }

  openEvent(id) {
    this.router.navigate(["/home/main/event/virtual-event-details/" + id]);
  }
}
