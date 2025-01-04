import { Component, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../shared.service';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ProgressComponent,
  RowComponent,
  TextColorDirective,
} from '@coreui/angular';

import {
  ToastBodyComponent,
  ToastComponent,
  ToasterComponent,
  ToastHeaderComponent
} from '@coreui/angular';

// interface IResponse {
//   published: string;
//   arxiv_id: string;
//   title: string;
//   score: number;
//   summary: string;
// }

interface IResponse {
  message: string;
}

@Component({
  selector: 'app-agente',
  imports: [FormsModule,
    CommonModule,
    HttpClientModule,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    ReactiveFormsModule,
    ProgressComponent,
    ToasterComponent,
    ToastComponent,
    ToastHeaderComponent,
    ToastBodyComponent],
  templateUrl: './agente.component.html',
  styleUrl: './agente.component.scss'
})
export class AgenteComponent implements OnInit {

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  public userMessage = '';
  public agentResponse = '';

  public toastMessage = 'Errore durante l\'invio del messaggio';

  public loading = false;
  public showToast = false;
  public serviceAPIPath = '';

  position = 'top-end';
  visible = signal(false);
  percentage = signal(0);

  private subscription!: Subscription;
  ngOnInit(): void {
    this.subscription = this.sharedService.apiPath$.subscribe(data => {
      this.serviceAPIPath = data;
    });
  }

  public sendQuery(query: string): void {

    const apiEndPoint = this.serviceAPIPath;

    console.log('API Path:', apiEndPoint);

    this.loading = true;
    this.agentResponse = `
      <p class="card-text placeholder-glow">
        <span class="placeholder col-7"></span>
        <span class="placeholder col-5"></span>
        <span class="placeholder col-6"></span>
        <span class="placeholder col-8"></span>
        <span class="placeholder col-4"></span>
        <span class="placeholder col-3"></span>
        <span class="placeholder col-9"></span>
        <span class="placeholder col-2"></span>
        <span class="placeholder col-7"></span>
        <span class="placeholder col-5"></span>
        <span class="placeholder col-6"></span>
        <span class="placeholder col-8"></span>
        <span class="placeholder col-4"></span>
        <span class="placeholder col-3"></span>
        <span class="placeholder col-9"></span>
        <span class="placeholder col-2"></span>
      </p>
    `;

    const payload = { query: query };

    console.log('Invio query:' + payload + "Al path:" + apiEndPoint + "agent");

    this.http.post<IResponse>(apiEndPoint + "agent", payload, { headers: { 'Content-Type': 'application/json' } })
      .subscribe({
        next: (response) => {
          console.log('Risposta ricevuta:', response);
          this.agentResponse = `
            <div>
              <strong style="font-size: 1.2em;">Messaggio di output:</strong> ${response.message || 'Nessun messaggio'}
              <br>
            </div>
          `;
          this.loading = false;
        },
        error: (error) => {
          console.error('Errore durante la richiesta:', error);
          this.toggleToast();
          this.loading = false;
          this.agentResponse = "❌"
        }
      });
  }

  public sendAgentResponse(): void {
    this.sendQuery(this.userMessage);
    console.log('Messaggio inviato:', this.userMessage);
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
