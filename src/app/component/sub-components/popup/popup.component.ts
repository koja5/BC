import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { PopupAnswer } from 'src/app/models/popup-answer';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: "app-popup",
  templateUrl: "./popup.component.html",
  styleUrls: ["./popup.component.scss"],
})
export class PopupComponent implements OnInit {
  @Input() title: string;
  @Input() text: any;
  @Input() ind: boolean;
  @Input() functionNameYes: string;
  @Input() functionNameNo: string;
  @Output() answerEmitter = new EventEmitter<any>();

  public windowWidth: number;
  public windowHeight: number;
  public language: any;
  public popupAnswer = new PopupAnswer();

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    } else {
      this.windowWidth = null;
      this.windowHeight = null;
    }
  }

  constructor(private helpService: HelpService) {}

  ngOnInit() {
    this.initialization();
  }

  initialization() {
    this.language = this.helpService.getLanguage();
    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }
  }

  answer(event) {
    this.popupAnswer.answer = event;
    this.popupAnswer.functionNameYes = this.functionNameYes;
    this.popupAnswer.functionNameNo = this.functionNameNo;
    this.answerEmitter.emit(this.popupAnswer);
  }
}
