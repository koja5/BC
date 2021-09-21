import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserModel } from '../models/user-model';
import { Observable } from 'rxjs';
import { UserConfiguration } from '../models/user-configuration';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getGridConfiguration(type) {
    return this.http.get('../assets/configuration/grid/' + type + '.json')
      .pipe(map((res) => res));
  }

  getGridConfigurationScheme(type) {
    return this.http.get('../assets/configuration/scheme/' + type + '.json')
      .pipe(map((res) => res));
  }

  createTranslation(data) {
    return this.http.post('/api/createTranslation', data)
      .pipe(map((res) => res));
  }

  updateTranslation(data) {
    return this.http.post('/api/updateTranslation', data)
      .pipe(map((res) => res));
  }

  getTranslation() {
    return this.http.get('/api/getTranslation')
      .pipe(map((res) => res));
  }

  getAllUsers() {
    return this.http.get('/api/getAllUsers')
      .pipe(map((res) => res));
  }

  getUserConfiguration(id: number): Observable<UserConfiguration> {
    return this.http.get<UserConfiguration>('/api/getConfiguration/' + id)
      .pipe(map((res) => res));
  }

  getTranslationFromFS(language: string) {
    return this.http.get('../assets/configuration/translation/' + language + '.json')
      .pipe(map((res) => res));
  }

  getTranslationWithId(id) {
    return this.http.get('/api/getTranslationWithId/' + id)
      .pipe(map((res) => res));
  }
}
