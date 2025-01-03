import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private _apiPathSubject: BehaviorSubject<string>;

  public apiPath$: Observable<string>;

  constructor(private cookieService: CookieService) {
    const endPointDefault = 'http://192.268.1.26:5001/query';
    this._apiPathSubject = new BehaviorSubject<string>("");
    this.apiPath$ = this._apiPathSubject.asObservable();
    this.setApiPath(endPointDefault);
  }

  setApiPath(path: string): void {
    this._apiPathSubject.next(path);
    this.cookieService.set('apiPath', path, 7);
    console.log('API Path set to: ' + path);
  }

  getApiPath(): string {
    return this._apiPathSubject.value;
  }
}
