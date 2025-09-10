import { InteractionApi } from '@/shop/api/interaction-api';
import { Comment } from '@/shop/models/comment.model';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Page, Pageable, WithPage } from '@shared/models/pageable.model';
import { AlertStore } from '@shared/stores/alert-store';
import { ModalStore } from '@shared/stores/modal-store';
import { LucideAngularModule, MessageCirclePlus, MessageCircleReply, Reply } from 'lucide-angular';

@Component({
  selector: 'shop-replies',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './replies.html',
  styles: ``,
})
export class Replies extends WithPage<Comment> {
  private readonly formBuilder = inject(FormBuilder);
  private readonly interactionApi = inject(InteractionApi);
  private readonly alertStore = inject(AlertStore);

  readonly ShowMessage = MessageCirclePlus;
  readonly Message = MessageCircleReply;
  readonly Send = Reply;

  readonly productId = input.required<number>();
  readonly commendId = input.required<number>();
  readonly authenticated = input.required<boolean>();
  readonly show = signal<boolean>(false);
  readonly page = signal<number>(0);

  loading = false;
  waiting = false;
  replies?: Page<Comment>;

  replyForm: FormGroup = this.formBuilder.group({
    content: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor() {
    super();
    effect(() => {
      this.loadReplies({ page: this.page(), size: 3 });
    });
  }

  checkField(field: string): boolean | undefined {
    return this.replyForm.get(field)?.touched && this.replyForm.get(field)?.invalid;
  }

  reply() {
    this.waiting = true;
    if (this.replyForm.invalid) {
      this.alertStore.addAlert({
        message: 'Revisa los campos inválidos',
        type: 'error',
      });
      this.waiting = false;
      return;
    }

    const reply: Comment = this.replyForm.getRawValue();
    this.interactionApi.createReply(this.productId(), this.commendId(), reply).subscribe({
      next: () => {
        this.replyForm.reset();
        this.loadReplies({ page: this.page() }, false);
        this.waiting = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertStore.addAlert({
          message: error.error.message,
          type: 'error',
        });
        this.waiting = false;
      },
    });
  }

  private loadReplies(query: Pageable<{}> = {}, append = true) {
    this.loading = true;
    this.interactionApi.getReplies(this.productId(), this.commendId(), query).subscribe({
      next: (replies) => {
        if (append) {
          replies.content.unshift(...(this.replies?.content || []));
        }
        this.replies = replies;
        this.loading = false;
        this.page.set(replies.page.number);
      },
      error: (error: HttpErrorResponse) => {
        this.alertStore.addAlert({
          message: error.error.message,
          type: 'error',
        });
        this.loading = false;
        this.page.set(0);
      },
    });
  }
}
