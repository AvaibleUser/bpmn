import { InteractionApi } from '@/shop/api/interaction-api';
import { Replies } from '@/shop/components/replies/replies';
import { Comment } from '@/shop/models/comment.model';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Page, Pageable, WithPage } from '@shared/models/pageable.model';
import { AlertStore } from '@shared/stores/alert-store';
import { CacheStore } from '@shared/stores/cache-store';
import {
  LucideAngularModule,
  MessageCircle,
  MessageCirclePlus,
  SendHorizontal,
} from 'lucide-angular';

@Component({
  selector: 'shop-comments',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, Replies],
  templateUrl: './comments.html',
  styles: ``,
})
export class Comments extends WithPage<Comment> {
  private readonly formBuilder = inject(FormBuilder);
  private readonly interactionApi = inject(InteractionApi);
  private readonly alertStore = inject(AlertStore);
  private readonly cacheStore = inject(CacheStore);
  private readonly router = inject(Router);

  readonly ShowMessage = MessageCirclePlus;
  readonly Message = MessageCircle;
  readonly Send = SendHorizontal;

  readonly productId = input.required<number>();
  readonly authenticated = input.required<boolean>();
  readonly page = signal<number>(0);

  loading = false;
  waiting = false;
  comments?: Page<Comment>;

  commentForm: FormGroup = this.formBuilder.group({
    content: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor() {
    super();
    effect(() => {
      this.loadComments({ page: this.page() });
    });
  }

  checkField(field: string): boolean | undefined {
    return this.commentForm.get(field)?.touched && this.commentForm.get(field)?.invalid;
  }

  comment() {
    if (!this.authenticated()) {
      this.cacheStore.set('redirect', this.router.url);
      this.router.navigate(['/auth', 'login']);
      return;
    }
    this.waiting = true;
    if (this.commentForm.invalid) {
      this.alertStore.addAlert({
        message: 'Revisa los campos inválidos',
        type: 'error',
      });
      this.waiting = false;
      return;
    }

    const comment: Comment = this.commentForm.getRawValue();
    this.interactionApi.createComment(this.productId(), comment).subscribe({
      next: () => {
        this.commentForm.reset();
        this.loadComments({ page: this.page() }, false);
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

  private loadComments(query: Pageable<{}> = {}, append = true) {
    this.loading = true;
    this.interactionApi.getComments(this.productId(), query).subscribe({
      next: (comments) => {
        if (append) {
          comments.content.unshift(...(this.comments?.content || []));
        }
        this.comments = comments;
        this.loading = false;
        this.page.set(comments.page.number);
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
