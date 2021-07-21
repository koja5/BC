import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { pipe } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DynamicService {
  constructor(private http: HttpClient) { }

  getConfiguration(path: string, file: string) {
    const url = "./assets/configuration/" + path + "/" + file + ".json";
    return this.http.get(url).pipe(map((res) => res));
  }

  callApiPost(api, body) {
    return this.http.post(api, body).pipe(map((res) => res));
  }

  callApiGet(api, parameters) {
    return this.http.get(this.concatenateRequest(api, parameters));
  }

  concatenateRequest(method, parametars) {
    let values = "";
    if (parametars) {
      if (parametars.length) {
        for (let i = 0; i < parametars.length; i++) {
          values += parametars[i] + "/";
        }

        return method + "/" + values;
      } else {
        return method + "/" + parametars;
      }
    }

    return method;
  }
}
