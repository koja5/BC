import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';


@Injectable()
export class MailService {

    constructor(public http: HttpClient) { }

    public sendMail(data, callback) {
        console.log(data);
        const headers = new HttpHeaders();
        console.log('service mail servicee');
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/send', data, { headers: headers })
            .map(res => res)
            .subscribe(val => callback(val));
    }
    
    public sendForgetMail(data) {
      const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/forgotmail', data, { headers: headers })
            .map(res => res);
    }

    public posaljiMiPoruku(data, callback) {
        this.http.post('/api/askQuestion', data)
            .map(res => res)
            .subscribe(val => callback(val));

    }


}
