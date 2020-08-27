import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/map";
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class HelpService {
  public language: any;

  constructor(
    public domSanitizer: DomSanitizer,
    private toastr: ToastrService
  ) {
    this.language = JSON.parse(localStorage.getItem("language"));
  }

  getMyDirectorUser(id: number, sid: string) {
    const splitSid = sid.split("-");
    let i = 0;
    for (i; i < splitSid.length; i++) {
      if (splitSid[i] === id.toString()) {
        break;
      }
    }

    if (splitSid.length !== 0 && i > 0) {
      return splitSid[i - 1];
    } else {
      return sid;
    }
  }

  getImage(name) {
    console.log(name);
    if (name) {
      return this.createImageFromBlob(name);
    } else {
      return "../../assets/img/profile_image/no-image.png";
    }
  }

  createImageFromBlob(image) {
    /*let TYPED_ARRAY = new Uint8Array(image.data);
    const STRING_CHAR = String.fromCharCode.apply(null, TYPED_ARRAY);*/
    const STRING_CHAR = this.arrayBufferToBase64(image.data);
    let base64String = btoa(STRING_CHAR);
    return this.domSanitizer.bypassSecurityTrustUrl(
      "data:image/jpg;base64, " + base64String
    );
  }

  arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return binary;
  }

  validate(control) {
    const codeLengths = {
      AD: 24,
      AE: 23,
      AL: 28,
      AT: 20,
      AZ: 28,
      BA: 20,
      BE: 16,
      BG: 22,
      BH: 22,
      BR: 29,
      CH: 21,
      CR: 21,
      CY: 28,
      CZ: 24,
      DE: 22,
      DK: 18,
      DO: 28,
      EE: 20,
      ES: 24,
      LC: 30,
      FI: 18,
      FO: 18,
      FR: 27,
      GB: 22,
      GI: 23,
      GL: 18,
      GR: 27,
      GT: 28,
      HR: 21,
      HU: 28,
      IE: 22,
      IL: 23,
      IS: 26,
      IT: 27,
      JO: 30,
      KW: 30,
      KZ: 20,
      LB: 28,
      LI: 21,
      LT: 20,
      LU: 20,
      LV: 21,
      MC: 27,
      MD: 24,
      ME: 22,
      MK: 19,
      MR: 27,
      MT: 31,
      MU: 30,
      NL: 18,
      NO: 15,
      PK: 24,
      PL: 28,
      PS: 29,
      PT: 25,
      QA: 29,
      RO: 24,
      RS: 22,
      SA: 24,
      SE: 24,
      SI: 19,
      SK: 24,
      SM: 27,
      TN: 24,
      TR: 26,
    };
    if (control) {
      const iban = control
        .toString()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");
      const code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);
      let digits: number;
      if (!code || iban.length !== codeLengths[code[1]]) {
        return false;
      }
      digits = (code[3] + code[1] + code[2]).replace(
        /[A-Z]/g,
        (letter: string) => {
          return letter.charCodeAt(0) - 55;
        }
      );
      return this.mod97(digits) === 1 ? true : false;
    }
  }

  private mod97(digital: number | string) {
    digital = digital.toString();
    let checksum: number | string = digital.slice(0, 2);
    let fragment = "";
    for (let offset = 2; offset < digital.length; offset += 7) {
      fragment = checksum + digital.substring(offset, offset + 7);
      checksum = parseInt(fragment, 10) % 97;
    }
    return checksum;
  }

  createSuccessMessage() {
    this.toastr.success(
      this.language.adminSuccessCreateTitle,
      this.language.adminSuccessCreateText,
      {
        timeOut: 7000,
        positionClass: "toast-bottom-right",
      }
    );
  }

  createErrorMessage() {
    this.toastr.error(
      this.language.adminErrorCreateTitle,
      this.language.adminErrorCreateText,
      {
        timeOut: 7000,
        positionClass: "toast-bottom-right",
      }
    );
  }

  updateSuccessMessage() {
    this.toastr.success(
      this.language.adminSuccessUpdateTitle,
      this.language.adminSuccessUpdateText,
      {
        timeOut: 7000,
        positionClass: "toast-bottom-right",
      }
    );
  }

  updateErrorMessage() {
    this.toastr.error(
      this.language.adminErrorUpdateTitle,
      this.language.adminErrorUpdateText,
      {
        timeOut: 7000,
        positionClass: "toast-bottom-right",
      }
    );
  }

  deleteSuccessMessage() {
    this.toastr.success(
      this.language.adminDeleteTitle,
      this.language.adminDeleteText,
      {
        timeOut: 7000,
        positionClass: "toast-bottom-right",
      }
    );
  }

  deleteErrorMessage() {
    this.toastr.error(
      this.language.adminDeleteTitle,
      this.language.adminDeleteText,
      {
        timeOut: 7000,
        positionClass: "toast-bottom-right",
      }
    );
  }
}
