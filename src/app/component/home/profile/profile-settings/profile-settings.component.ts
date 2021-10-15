import { HttpClient } from '@angular/common/http';
import * as sha1 from "sha1";
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { RecommendationModel } from 'src/app/models/recommendation-model';
import { EditProfileService } from 'src/app/services/edit-profile.service';
import { HelpService } from 'src/app/services/help.service';
import { LoginService } from 'src/app/services/login.service';
import { ProfileService } from 'src/app/services/profile.service';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {
  public id: string;
  public data: any;
  public language: any;
  public languages;
  public languageList;
  public languageListLoading = false;
  public selectedLanguage: any;
  public selectedTab: string = 'language';
  public user: any;

  constructor(
    public route: ActivatedRoute,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public helpService: HelpService,
    public editProfileService: EditProfileService,
    private translationService: TranslationService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.id = localStorage.getItem("id");
    this.language = this.helpService.getLanguage();
    this.user = JSON.parse(localStorage.getItem("user"));
    this.initialization();
  }

  initialization() {
    this.editProfileService.getUserInfoSHA1(this.id).subscribe((data) => {
      this.data = data[0];
      console.log(data);
    });

    this.loginService.getLanguages().subscribe(data => {
      this.languages = data.map(x => ({
        name: x.language,
        code: x.languageCode
      }));
      this.languageList = this.languages;
    }
    );

  }

  changeTab(tab) {
    this.selectedTab = tab;
  }

  onValueChange(event) {
    console.log(event);
    if (event === undefined) {
      this.selectedLanguage = null;
    } else {
      this.selectedLanguage = event;
    }
  }

  selectionChangeLanguage(event) {
    console.log(event);
  }

  searchLanguage(event: string) {
    const searchValue = event.toLowerCase();

    if (searchValue !== "" && searchValue.length > 1) {
      this.languageListLoading = true;

      console.log(searchValue);
      const temp: { code: string, name: string }[] = this.languages;
      this.languageList = temp.filter(x => x.name.toLowerCase().startsWith(event, 0));

      this.languageListLoading = false;
    } else {
      this.languageList = [];
    }
  }

  changeLanguage(): void {
    if (!this.selectedLanguage) { return; }
    this.helpService.setLanguageCode(this.selectedLanguage.code);

    this.translationService.getTranslation(this.selectedLanguage.code).subscribe((data) => {
      console.log(data);
      this.language = data;
      this.helpService.setLanguage(data);
      location.reload();
    });
  }

}
