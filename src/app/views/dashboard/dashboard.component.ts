import { DOCUMENT, NgStyle } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective,
} from '@coreui/angular';


import {
  ToastBodyComponent,
  ToastComponent,
  ToasterComponent,
  ToastHeaderComponent
} from '@coreui/angular';

interface IMessage {
  text: string;
  user: boolean;
}


@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [FormsModule, CommonModule, HttpClientModule, TextColorDirective, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, ReactiveFormsModule, ButtonDirective, ProgressComponent, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent]


})
export class DashboardComponent implements OnInit {
    constructor(private http: HttpClient) { }

  public userMessage = '';
  public botResponse = '';

  public toastMessage = 'Errore durante l\'invio del messaggio';

  public apiEndpoint : string = "http://localhost:7777/query";
  public loading = false;
  public showToast = false;

  position = 'top-end';
  visible = signal(false);
  percentage = signal(0);

  ngOnInit(): void {
    // Inizializzazione se necessaria
  }

  sendMessage(): void {
    // Verifica se il messaggio dell'utente non è vuoto o composto solo da spazi
    if (!this.userMessage.trim()) {
        return; // Esci dalla funzione se il messaggio è vuoto
    }

    // Imposta lo stato di caricamento a true
    this.loading = true;

    // Invia la richiesta POST all'API
    this.http.post<{ response: string }>(this.apiEndpoint, { query: this.userMessage.trim() }).subscribe({
        next: (response) => {
            // Gestisci la risposta dell'API
            this.botResponse = response.response; // Imposta la risposta del bot
            console.log(response.response);
            this.loading = false; // Disabilita lo stato di caricamento
        },
        error: (error) => {
            // Gestisci gli errori
            console.error('Errore durante l\'invio del messaggio:', error); // Log dell'errore
            this.toggleToast(); // Mostra un toast di errore
            this.loading = false; // Disabilita lo stato di caricamento
            this.botResponse = 'Errore durante l\'invio del messaggio'; // Imposta un messaggio di errore
        },
        complete: () => {
            // Azioni da eseguire al completamento della richiesta (opzionale)
            this.userMessage = ''; // Resetta il campo del messaggio dell'utente
        }
    });
}


  closeToast(): void {
    this.showToast = false;
  }

  toggleToast() {
    this.visible.update((value) => !value);
  }

  onVisibleChange($event: boolean) {
    this.visible.set($event);
    this.percentage.set(this.visible() ? this.percentage() : 0);
  }

  onTimerChange($event: number) {
    this.percentage.set($event * 25);
  }
}
