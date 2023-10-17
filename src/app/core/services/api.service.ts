import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, retry } from 'rxjs/operators';
import { HandledError } from 'src/app/services/error-wrappers/handled-error';
import { UnHandledError } from 'src/app/services/error-wrappers/unhandled-error';
import { Observable } from 'rxjs';

export class ApiService {
  private readonly apiUrl = "";
  constructor(private http: HttpClient) {}

  get(url: string) {

    return this.http.get(this.apiUrl + url).pipe(
      map(x => this.responseHandler(x)),
      retry(1),
      catchError(x => this.responseHandler(x))
    );
  }

  post(url: string, data: any) {
    return this.http.post(this.apiUrl + url, data).pipe(
      map(x => this.responseHandler(x)),
      catchError(x => this.responseHandler(x))
    );

  }

  private responseHandler(x: any) {
    if (x.hasOwnProperty('didError') && !x['didError']) {
      return x['model'];
    } else {
      this.errorHandler(x);
    }
  }

  private errorHandler(x: any) {
    if (x.hasOwnProperty('errorMessage') && !x['errorMessage']) {
      throw new HandledError(x['errorMessage']);
    } else {
      throw new UnHandledError('unhandled error');
    }
  }

  getJson(path: string): Observable<unknown>{
    return this.http.get(path);
  }

  // get data from ready-made api endpoints
  getFakeAPI(url: string): Observable<unknown> {
    return this.http.get(url);
  }

}
