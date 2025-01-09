import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private _apiPathSubject: BehaviorSubject<string>;

  private _apiKeySubject: BehaviorSubject<string>;

  public apiPath$: Observable<string>;

  public apiKey$: Observable<string>;

  constructor(private cookieService: CookieService) {
    const endPointDefault = 'http://192.168.1.26:5001/';
    const apiKeyDefault = 'XXXXXXXX'
    this._apiPathSubject = new BehaviorSubject<string>("");
    this._apiKeySubject = new BehaviorSubject<string>("");
    this.apiPath$ = this._apiPathSubject.asObservable();
    this.apiKey$ = this._apiKeySubject.asObservable();
    this.setApiPath(endPointDefault);
    this.setApiKey(apiKeyDefault);

  }

  setApiPath(path: string): void {
    this._apiPathSubject.next(path);
    this.cookieService.set('apiPath', path, 7);
    console.log('API Path set to: ' + path);
  }

  setApiKey(key: string): void {
    this._apiKeySubject.next(key);
    this.cookieService.set('apiKey', key);
    console.log('API Key set to: ' + key);
  }

  getApiPath(): string {
    return this._apiPathSubject.value;
  }

  getApiKey(): string {
    return this._apiKeySubject.value;
  }
}
