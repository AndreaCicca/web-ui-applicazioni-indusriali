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
    const savedApiPath = this.cookieService.get('apiPath') || '';
    this._apiPathSubject = new BehaviorSubject<string>(savedApiPath);
    this.apiPath$ = this._apiPathSubject.asObservable();
  }

  setApiPath(path: string): void {
    this._apiPathSubject.next(path);
    this.cookieService.set('apiPath', path);
    console.log('API Path set to: ' + path);
  }

  getApiPath(): string {
    return this._apiPathSubject.value;
  }
}