import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  // Dizionario che può contenere chiavi (string) con valori di qualsiasi tipo
  private _dataSubject = new BehaviorSubject<{ [key: string]: any }>({});

  // Espongo come Observable
  public data$ = this._dataSubject.asObservable();

  constructor() {}

  // Imposta o aggiorna una proprietà nel dizionario
  set(key: string, value: any): void {
    const currentData = this._dataSubject.value;
    // Aggiorno la chiave specifica con il nuovo valore
    currentData[key] = value;
    // Faccio il next dello stato modificato
    this._dataSubject.next({ ...currentData });
    // Spread operator per forzare un nuovo oggetto e triggherare correttamente la subscription
  }

  // Rimuove una proprietà dal dizionario (se esiste)
  remove(key: string): void {
    const currentData = this._dataSubject.value;
    if (currentData.hasOwnProperty(key)) {
      delete currentData[key];
      this._dataSubject.next({ ...currentData });
    }
  }

  // Recupera il valore corrente della proprietà (se voglio accedervi in modo imperativo)
  get(key: string): any {
    return this._dataSubject.value[key];
  }

  // Recupera l'intero dizionario
  getAll(): { [key: string]: any } {
    return { ...this._dataSubject.value };
  }
}
