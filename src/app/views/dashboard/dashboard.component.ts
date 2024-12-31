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
  title: string;
  score: number;
  summary: string;
}


@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [FormsModule, CommonModule, HttpClientModule, TextColorDirective, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, ReactiveFormsModule, ButtonDirective, ProgressComponent, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent]


})
export class DashboardComponent implements OnInit {
    constructor(private http: HttpClient, private sharedService: SharedService) { }

  public userMessage = '';
  public botResponse = '';

  public toastMessage = 'Errore durante l\'invio del messaggio';

  public apiEndpoint : string = "http://localhost:5001/query";
  public loading = false;
  public showToast = false;

  public serviceAPIPath = '';

  private subscription!: Subscription;



  position = 'top-end';
  visible = signal(false);
  percentage = signal(0);

  ngOnInit(): void {
    this.subscription = this.sharedService.apiPath$.subscribe(data => {
      this.serviceAPIPath = data;
    });
  }
  public sendQuery(query: string): void {
    this.loading = true;
    const payload = { query: query };
    this.http.post<IResponse[]>(this.apiEndpoint, payload, { headers: { 'Content-Type': 'application/json' } })
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.botResponse = response.map((result: IResponse) => `
              <div>
                <strong style="font-size: 1.2em;">Titolo:</strong> ${result.title || 'Nessun titolo'}
                <br>
                <strong>Punteggio:</strong> ${result.score || 'Nessun punteggio'}
                <br>
                <strong>Riassunto:</strong> ${result.summary || 'Nessun riassunto'}
              </div>
            `).join('<hr>');
          } else {
            this.botResponse = 'Nessuna risposta trovata';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Errore durante la richiesta:', error);
          this.showToast = true;
          this.loading = false;
        }
      });
  }

  public sendMessage(): void {
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
