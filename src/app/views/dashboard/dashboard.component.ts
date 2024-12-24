import { DOCUMENT, NgStyle } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { HttpClient , HttpClientModule} from '@angular/common/http';
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
  TextColorDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';

import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

interface IMessage {
  text: string;
  user: boolean;
}


@Component({
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss'],
    imports: [FormsModule, CommonModule,HttpClientModule, TextColorDirective, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, ReactiveFormsModule]
})
export class DashboardComponent implements OnInit {

  constructor(private http: HttpClient) {}

  public userMessage = '';
  public messages: IMessage[] = [];

  ngOnInit(): void {
    this.messages = [
      { text: 'Ciao! Come posso aiutarti oggi?', user: false },
      { text: 'Vorrei sapere di più sui vostri servizi.', user: true },
      { text: 'Certo! Offriamo una vasta gamma di servizi per soddisfare le tue esigenze.', user: false }
    ];
  }

  sendMessage(): void {
    if (this.userMessage.trim()) {
      this.messages.push({ text: this.userMessage, user: true });
      this.http.post<{ response: string }>('YOUR_API_ENDPOINT', { message: this.userMessage }).subscribe(
        (response) => {
          this.messages.push({ text: response.response, user: false });
        },
        (error) => {
          console.error('Error:', error);
        }
      );
      this.userMessage = '';
    }
  }

}
