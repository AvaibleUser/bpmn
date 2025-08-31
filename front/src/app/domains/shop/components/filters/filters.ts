import { DiscographyQuery, Format } from '@/shop/models/discography.model';
import { CommonModule } from '@angular/common';
import { Component, inject, model, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AlertStore } from '@shared/stores/alert-store';

@Component({
  selector: 'shop-filters',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filters.html',
})
export class Filters {
  private readonly formBuilder = inject(FormBuilder);
  private readonly alertStore = inject(AlertStore);

  readonly filtersForm = this.formBuilder.group({
    genreId: [0],
    title: [''],
    artist: [''],
    year: [0],
    priceMin: [0],
    priceMax: [0],
    format: ['' as Format],
  });

  readonly filter = output<DiscographyQuery>();
  readonly waiting = model.required<boolean>();

  filterDiscography() {
    this.waiting.set(true);
    if (this.filtersForm.invalid) {
      this.alertStore.addAlert({
        message: 'Revisa los campos inválidos',
        type: 'error',
      });
      this.waiting.set(false);
      return;
    }

    const filters: DiscographyQuery = this.filtersForm.getRawValue();
    (Object.keys(filters) as (keyof DiscographyQuery)[]).forEach((key) => {
      if (!filters[key] || filters[key] === '0') {
        delete filters[key];
      }
    });
    if ((filters.priceMin || 0) > (filters.priceMax || 1000)) {
      delete filters.priceMax;
    }
    if (filters.priceMin) {
      filters.priceMin = -filters.priceMin;
    }
    if (filters.priceMax) {
      filters.priceMax = 1000 + filters.priceMax;
    }
    this.filter.emit(filters);
  }

  genres = [
    {
      id: 1,
      name: 'Rock',
    },
    {
      id: 2,
      name: 'Pop',
    },
    {
      id: 3,
      name: 'Jazz',
    },
  ];
}
