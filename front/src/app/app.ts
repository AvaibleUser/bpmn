import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Alerts } from '@shared/components/alerts/alerts';
import { Modal } from '@shared/components/modal/modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Alerts, Modal],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('bpmn-front');
}
