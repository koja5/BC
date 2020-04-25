import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/map";
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from "@angular/platform-browser";

@Injectable({
  providedIn: "root",
})
export class HelpService {
  constructor(public domSanitizer: DomSanitizer) {}

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
}
