import { ProductsApi } from '@/shop/api/products-api';
import { Song } from '@/shop/models/song.model';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input } from '@angular/core';
import { AlertStore } from '@shared/stores/alert-store';
import { LucideAngularModule, Music } from 'lucide-angular';

@Component({
  selector: 'shop-songs',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './songs.html',
  styles: ``,
})
export class Songs {
  private readonly productsApi = inject(ProductsApi);
  private readonly alertStore = inject(AlertStore);

  readonly Song = Music;

  readonly productId = input.required<number>();

  songs?: Song[];

  constructor() {
    effect(() => {
      this.loadSongs();
    });
  }

  loadSongs() {
    this.productsApi.getSongs(this.productId()).subscribe({
      next: (songs) => (this.songs = songs),
      error: (error: HttpErrorResponse) => {
        this.alertStore.addAlert({
          message: error.error.message,
          type: 'error',
        });
      },
    });
  }
}
