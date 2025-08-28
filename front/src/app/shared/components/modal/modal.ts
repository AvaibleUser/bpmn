import { CommonModule } from '@angular/common';
import {
  Binding,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ModalStore } from '@shared/stores/modal-store';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-modal',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal implements OnInit, OnDestroy {
  private readonly modalStore = inject(ModalStore);

  readonly Close = X;

  @ViewChild('modal') modalRef!: ElementRef;
  @ViewChild('closeButton') closeButtonRef!: ElementRef;

  @ViewChild('content', { read: ViewContainerRef, static: true })
  content!: ViewContainerRef;

  ngOnInit() {
    this.modalStore.setModalCallback(
      async (loadComponent, bindings) => {
        this.content.clear();
        this.content.createComponent(await loadComponent(), { bindings });
        this.modalRef.nativeElement.showModal();
      },
      () => {
        this.content.clear();
        this.closeButtonRef.nativeElement.click();
      }
    );
  }

  ngOnDestroy() {
    this.modalStore.setModalCallback(undefined, undefined);
  }
}
