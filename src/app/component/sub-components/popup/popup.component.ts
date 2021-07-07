import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PopupAnswer } from 'src/app/models/popup-answer';
import { HelpService } from 'src/app/services/help.service';
import { DynamicDialogComponent } from "../../dynamic-elements/dynamic-dialog/dynamic-dialog.component";

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

  constructor(private helpService: HelpService,
    private modalService: NgbModal) {}

  ngOnInit() {
    this.initialization();
  }

  initialization() {
    this.language = this.helpService.getLanguage();

    if(this.language && this.ind){
      this.openModal();
    }

    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }
  }

  openModal():void{
    const modalRef=this.modalService.open(DynamicDialogComponent, {
      size:'sm',
      centered:true
    });
    
    modalRef.componentInstance.modalSettings={
      windowClass: 'modal fade in',
      resolve: {
        title: () => this.title ? this.title : '',
        text: () => this.text ? this.text : this.language.areYouSure,
        imageUrl: ()=> '../../../../../assets/img/sent.png',
        primaryButtonLabel: () => this.language.yes,
        secondaryButtonLabel: () => this.language.no,
        apply: ()=> this.answer(true),
        dismiss: ()=> this.answer(false)
      }
    };
    modalRef.componentInstance.modal=modalRef;
  }

  answer(event) {
    this.popupAnswer.answer = event;
    this.popupAnswer.functionNameYes = this.functionNameYes;
    this.popupAnswer.functionNameNo = this.functionNameNo;
    this.answerEmitter.emit(this.popupAnswer);
  }
}
