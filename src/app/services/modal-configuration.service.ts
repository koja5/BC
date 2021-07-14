import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalConfigurationService {

  constructor() { }

  setSettingsForAreYouSureDialog(componentInstance: any, language:any):void{
    componentInstance.modalSettings={
      windowClass: 'modal fade in',
      resolve: {
        title: () =>language.adminPleaseConfirm,
        text: () =>language.areYouSure,
        imageUrl: ()=> '../../../../../assets/img/sent.png',
        primaryButtonLabel: () =>language.yes,
        secondaryButtonLabel: () =>language.no
      }
    };
  }
}
