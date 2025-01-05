import { Component, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../shared.service';
import { marked } from 'marked';

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

  position = 'top-end';
  visible = signal(false);
  percentage = signal(0);

  private subscription!: Subscription;
  ngOnInit(): void {
    this.subscription = this.sharedService.apiPath$.subscribe(data => {
      this.serviceAPIPath = data;
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

    const payload = { query: query };

    console.log('Invio query:' + payload.query + "Al path:" + apiEndPoint + "agent");



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

}
