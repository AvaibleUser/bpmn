import { DiscographyInfo, DiscographyQuery } from '@/shop/models/discography.model';
import { Genre } from '@/shop/models/genre.model';
import { Song } from '@/shop/models/song.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environment/environment.development';
import { Page } from '@shared/models/pageable.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsApi {
  private readonly api = `${environment.apiUrl}`;
  private readonly http = inject(HttpClient);

  getDiscographies(query: DiscographyQuery): Observable<Page<DiscographyInfo>> {
    const params = Object.entries(query).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value.toString();
      }
      return acc;
    }, {} as Record<string, string | number | boolean>);
    return this.http.get<Page<DiscographyInfo>>(`${this.api}/discographies`, { params });
  }

  getDiscography(id: number): Observable<DiscographyInfo> {
    return this.http.get<DiscographyInfo>(`${this.api}/discographies/${id}`);
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.api}/genres`);
  }

  getSongs(discographyId: number): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.api}/discographies/${discographyId}/songs`);
  }

  checkCdGroup(discographyId: number): Observable<DiscographyInfo[]> {
    return this.http.get<DiscographyInfo[]>(`${this.api}/cds/${discographyId}/promotions`);
  }
}
