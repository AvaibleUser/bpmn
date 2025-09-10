import { Comment, CommentCreate } from '@/shop/models/comment.model';
import { RatingCreate, RatingStats } from '@/shop/models/rating.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environment/environment.development';
import { Page, Pageable } from '@shared/models/pageable.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InteractionApi {
  private readonly api = `${environment.apiUrl}`;
  private readonly http = inject(HttpClient);

  getRatingStats(discographyId: number): Observable<RatingStats> {
    return this.http.get<RatingStats>(`${this.api}/discographies/${discographyId}/ratings`);
  }

  createRating(discographyId: number, rating: RatingCreate): Observable<void> {
    return this.http.post<void>(`${this.api}/discographies/${discographyId}/ratings`, rating);
  }

  updateRating(discographyId: number, rating: Partial<RatingCreate>): Observable<void> {
    return this.http.put<void>(`${this.api}/discographies/${discographyId}/ratings`, rating);
  }

  getComments(discographyId: number, query: Pageable<{}>): Observable<Page<Comment>> {
    return this.http.get<Page<Comment>>(`${this.api}/discographies/${discographyId}/comments`, {
      params: { size: 9, ...query },
    });
  }

  getReplies(
    discographyId: number,
    commentId: number,
    query: Pageable<{}>
  ): Observable<Page<Comment>> {
    return this.http.get<Page<Comment>>(
      `${this.api}/discographies/${discographyId}/comments/${commentId}`,
      { params: { size: 9, ...query } }
    );
  }

  createComment(discographyId: number, comment: CommentCreate): Observable<void> {
    return this.http.post<void>(`${this.api}/discographies/${discographyId}/comments`, comment);
  }

  createReply(discographyId: number, commentId: number, comment: CommentCreate): Observable<void> {
    return this.http.post<void>(
      `${this.api}/discographies/${discographyId}/comments/${commentId}`,
      comment
    );
  }

  updateComment(discographyId: number, id: number, content: string): Observable<void> {
    return this.http.put<void>(`${this.api}/discographies/${discographyId}/comments/${id}`, {
      content,
    });
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/comments/${id}`);
  }
}
