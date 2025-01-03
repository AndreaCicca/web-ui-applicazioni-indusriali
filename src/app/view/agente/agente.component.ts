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

interface IResponse {
  published: string;
  arxiv_id: string;
  title: string;
  score: number;
  summary: string;
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
    ButtonDirective,
    ReactiveFormsModule,
    ButtonDirective,
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

    let apiEndPoint = this.serviceAPIPath;

    console.log('API Path:', apiEndPoint);

    this.loading = true;
    const payload = { query: query };

    console.log('Invio query:' +  payload + "Al path:" + apiEndPoint);

    this.http.post<IResponse[]>(apiEndPoint, payload, { headers: { 'Content-Type': 'application/json' } })
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.agentResponse = response.map((result: IResponse) => `
              <div>
                <strong style="font-size: 1.2em;">Titolo:</strong> ${result.title || 'Nessun titolo'}
                <br>
                <strong>Punteggio:</strong> ${result.score || 'Nessun punteggio'}
                <br>
                <strong>Riassunto:</strong> ${result.summary || 'Nessun riassunto'}
                <br>
                <strong>arXiv-ID:</strong> ${result.arxiv_id || 'N/A'}
                <br>
                <strong>Pubblicato:</strong> ${result.published || 'N/A'}
                <br>
                <a href="https://arxiv.org/pdf/${result.arxiv_id}" target="_blank">Link al paper</a>
              </div>
            `).join('<hr>');
          } else {
            this.agentResponse = 'Nessuna risposta trovata';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Errore durante la richiesta:', error);
          this.toggleToast();
          this.loading = false;
        }
      });
  }

  public sendAgentResponse(): void {
    this.sendQuery(this.userMessage);
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