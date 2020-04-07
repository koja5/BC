import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getGridConfiguration(type) {
    return this.http.get('../assets/configuration/grid/' + type + '.json')
      .map(res => res);
  }

  getGridConfigurationScheme(type) {
    return this.http.get('../assets/configuration/scheme/' + type + '.json')
      .map(res => res);
  }

  createTranslation(data) {
    return this.http.post('/api/createTranslation', data)
      .map(res => res);
  }

  updateTranslation(data) {
    return this.http.post('/api/updateTranslation', data)
      .map(res => res);
  }

  getTranslation() {
    return this.http.get('/api/getTranslation')
      .map(res => res);
  }

  getAllUsers() {
    return this.http.get('/api/getAllUsers')
      .map(res => res);
  }

  getTranslationFromFS(language: string) {
    return this.http.get('../assets/configuration/translation/' + language + '.json')
      .map(res => res);
  }

  getTranslationWithId(id) {
    return this.http.get('/api/getTranslationWithId/' + id)
      .map(res => res);
  }
}
