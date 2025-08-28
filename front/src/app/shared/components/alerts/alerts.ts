import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AlertStore } from '@shared/stores/alert-store';

@Component({
  selector: 'app-alerts',
  imports: [CommonModule],
  templateUrl: './alerts.html',
  styleUrl: './alerts.css',
})
export class Alerts {
  readonly alertStore = inject(AlertStore);
}
