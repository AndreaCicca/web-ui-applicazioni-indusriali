import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SharedService } from '../../shared.service';
import { TableModule, UtilitiesModule, FormModule, ButtonDirective } from '@coreui/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [FormsModule, FormModule, TableModule, UtilitiesModule, ButtonDirective]
})
export class SettingsComponent implements OnInit, OnDestroy {
  apiPath: string = '';
  apiKey: string = '';
  private subscription!: Subscription;

  constructor(public sharedService: SharedService) {}

  ngOnInit(): void {
    this.subscription = this.sharedService.apiPath$.subscribe(path => {
      this.apiPath = path;
    });
    this.subscription = this.sharedService.apiKey$.subscribe(key => {
      this.apiKey = key;
    });
  }

  saveApiPath(): void {
    this.sharedService.setApiPath(this.apiPath);
  }

  saveApiKey(): void {
    this.sharedService.setApiKey(this.apiKey);
  }

  getApiPath(): void {
    this.apiPath = this.sharedService.getApiPath();
  }

  getApiKey(): void {
    this.apiKey = this.sharedService.getApiKey();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
