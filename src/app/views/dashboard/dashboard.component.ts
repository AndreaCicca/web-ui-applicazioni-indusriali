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

  public apiEndpoint : string = "YOUR_API_ENDPOINT";
  public loading = false;
  public showToast = false;

  position = 'top-end';
  visible = signal(false);
  percentage = signal(0);

  ngOnInit(): void {
    // Inizializzazione se necessaria
  }

  sendMessage(): void {
    if (this.userMessage.trim()) {
      this.loading = true;
      this.http.post<{ response: string }>(this.apiEndpoint, { message: this.userMessage }).subscribe(
        (response) => {
          this.botResponse = response.response
          this.loading = false;
        },
        (error) => {
          this.toggleToast();
          this.loading = false;
          this.botResponse = 'Errore durante l\'invio del messaggio';
        }
      );
      this.userMessage = '';
    }
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
