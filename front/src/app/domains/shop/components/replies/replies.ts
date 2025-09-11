import { InteractionApi } from '@/shop/api/interaction-api';
import { Comment } from '@/shop/models/comment.model';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role } from '@core/auth/models/auth.model';
import { Page, Pageable, WithPage } from '@shared/models/pageable.model';
import { AlertStore } from '@shared/stores/alert-store';
import {
  Ban,
  LucideAngularModule,
  MessageCirclePlus,
  MessageCircleReply,
  Reply,
} from 'lucide-angular';

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
  readonly Ban = Ban;

  readonly productId = input.required<number>();
  readonly commenterId = input.required<number>();
  readonly commentId = input.required<number>();
  readonly userRole = input<Role>();
  readonly commentDeleted = output<void>();
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
    this.interactionApi.createReply(this.productId(), this.commentId(), reply).subscribe({
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

  ban() {
    this.interactionApi.deleteCommentByAdmin(this.commentId(), this.commenterId()).subscribe({
      next: () => {
        this.alertStore.addAlert({
          message: 'Comentario eliminado',
          type: 'success',
        });
        this.commentDeleted.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.alertStore.addAlert({
          message: error.error.message,
          type: 'error',
        });
      },
    });
  }

  reloadReplies() {
    this.page.set(0);
    this.loadReplies({ page: this.page() }, false);
  }

  private loadReplies(query: Pageable<{}> = {}, append = true) {
    this.loading = true;
    this.interactionApi.getReplies(this.productId(), this.commentId(), query).subscribe({
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
