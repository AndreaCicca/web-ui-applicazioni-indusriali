import { Component, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule} from '@angular/forms';
import { SharedService } from '../../shared.service';
import { marked } from 'marked';
import {ReactiveFormsModule } from '@angular/forms';

import {
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
  public serviceApiKey = '';

  public ckeckedApi = false;

  position = 'top-end';
  visible = signal(false);
  percentage = signal(0);

  private subscription!: Subscription;
  ngOnInit(): void {
    this.subscription = this.sharedService.apiPath$.subscribe(data => {
      this.serviceAPIPath = data;
    });

    this.subscription = this.sharedService.apiKey$.subscribe(data => {
      this.serviceApiKey = data;
    });
  }

  public renderMarkdown(markdown: string): void {
    const htmlContent = marked.parse(markdown);
    if (htmlContent instanceof Promise) {
      htmlContent.then((content) => {
        const agentResponseElement = document.getElementById('agentResponse');
        if (agentResponseElement) {
          agentResponseElement.innerHTML = content;
        }
      });
    } else {
      const agentResponseElement = document.getElementById('agentResponse');
      if (agentResponseElement) {
        agentResponseElement.innerHTML = htmlContent;
      }
    }
  }

  public sendQuery(query: string): void {

    const apiEndPoint = this.serviceAPIPath;
    const apiKey = this.serviceApiKey;
    let payload;
    console.log('API Path:', apiEndPoint);

    this.loading = true;
    // this.agentResponse = `
    //   <p class="card-text placeholder-glow">
    //     <span class="placeholder col-7"></span>
    //     <span class="placeholder col-5"></span>
    //     <span class="placeholder col-6"></span>
    //     <span class="placeholder col-8"></span>
    //     <span class="placeholder col-4"></span>
    //     <span class="placeholder col-3"></span>
    //     <span class="placeholder col-9"></span>
    //     <span class="placeholder col-2"></span>
    //     <span class="placeholder col-7"></span>
    //     <span class="placeholder col-5"></span>
    //     <span class="placeholder col-6"></span>
    //     <span class="placeholder col-8"></span>
    //     <span class="placeholder col-4"></span>
    //     <span class="placeholder col-3"></span>
    //     <span class="placeholder col-9"></span>
    //     <span class="placeholder col-2"></span>
    //   </p>
    // `;

    if (!this.ckeckedApi) {
      payload = { query: query, apiKey: ""};
      console.log('Invio query:' + payload.query + " Al path:" + apiEndPoint + "agent" + " senza chiave");

    } else{
      payload = { query: query, apiKey: apiKey};
      console.log('Invio query:' + payload.query + " Al path:" + apiEndPoint + "agent" + " Con Chiave " + apiKey);
    }


    this.http.post<IResponse>(apiEndPoint + "agent", payload, { headers: { 'Content-Type': 'application/json' } })
      .subscribe({
        next: (response) => {
          console.log('Risposta ricevuta:', response);
          this.renderMarkdown(response.message)
          this.loading = false;
        },
        error: (error) => {
          console.error('Errore durante la richiesta:', error);
          this.toggleToast();
          this.loading = false;
            const errorMessage = error.message || JSON.stringify(error);
            this.renderMarkdown("**Errore nella ricezione della risposta** \n\n" + errorMessage);
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

  onSwitchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.ckeckedApi = inputElement.checked;
    console.log('Stato dello switch:', this.ckeckedApi);
  }

}
