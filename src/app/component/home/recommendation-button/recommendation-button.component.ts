import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { InviteModel } from "src/app/models/invite-model";
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: "app-recommendation-button",
  templateUrl: "./recommendation-button.component.html",
  styleUrls: ["./recommendation-button.component.scss"],
})
export class RecommendationButtonComponent implements OnInit {
  @Input() id: string;
  @Input() name: string;
  @Input() email: string;
  @Input() phone: string;
  @Input() recommendedWindow: boolean;
  @Output() recommendedWindowEmitter = new EventEmitter<null>();

  public windowHeight: any;
  public windowWidth: any;
  public language: any;
  public directorLoading = false;
  public directorList: any;
  public selectedDirector = null;
  public contactFormWindow = false;
  public recommendationData = new InviteModel();
  public me: any;
  public recommendationSelection = "system-member";

  constructor(
    private helpService: HelpService
  ) { }

  ngOnInit() {
    if (window.innerWidth < 768) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }
    this.language = this.helpService.getLanguage();
    this.me = JSON.parse(localStorage.getItem("user"));
    this.recommendationData.message = this.language.recommendedMessage;
  }

}
