import { ProductsApi } from '@/shop/api/products-api';
import {
  CassetteCondition,
  CreateDiscography,
  Format,
  VinylSize,
} from '@/shop/models/discography.model';
import { Genre } from '@/shop/models/genre.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertStore } from '@shared/stores/alert-store';

@Component({
  selector: 'shop-add-product',
  imports: [ReactiveFormsModule],
  templateUrl: './add-product.html',
  styles: ``,
})
export class AddProduct implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly productsApi = inject(ProductsApi);
  private readonly alertStore = inject(AlertStore);

  addForm: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    artist: ['', [Validators.required, Validators.minLength(2)]],
    genreId: [0, [Validators.required]],
    year: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, []],
    format: ['' as Format, [Validators.required]],
    release: [0, []],
    condition: ['' as CassetteCondition, []],
    size: [0 as VinylSize, []],
    specialEdition: ['', []],
  });
  image?: File;

  waiting = false;
  genres?: Genre[];
  limitedStock = signal<boolean>(true);
  released = signal<boolean>(true);
  formats: { label: string; value: Format }[] = [
    { label: 'Vinilo', value: 'VINYL' },
    { label: 'CD', value: 'CD' },
    { label: 'Cassette', value: 'CASSETTE' },
  ];
  conditions: { label: string; value: CassetteCondition }[] = [
    { label: 'Nueva', value: 'NEW' },
    { label: 'Usada', value: 'USED' },
    { label: 'Semi usada', value: 'SEMI_USED' },
  ];
  sizes: { label: string; value: VinylSize }[] = [
    { label: '7"', value: 7 },
    { label: '10"', value: 10 },
    { label: '12"', value: 12 },
  ];

  ngOnInit() {
    this.productsApi.getGenres().subscribe((genres) => {
      this.genres = genres;
    });
  }

  onFileChange(event: any) {
    if (event.target?.files.length > 0) {
      this.image = event.target.files[0];
    }
  }

  checkField(field: string): boolean | undefined {
    return this.addForm.get(field)?.touched && this.addForm.get(field)?.invalid;
  }

  addProduct() {
    this.waiting = true;
    if (this.addForm.invalid) {
      this.alertStore.addAlert({
        message: 'Revisa los campos inválidos',
        type: 'error',
      });
      this.waiting = false;
      return;
    }

    const product: CreateDiscography = this.addForm.getRawValue();
    product.visible = true;
    if (!product.release || this.released()) {
      delete product.release;
    }
    if (!product.stock || !this.limitedStock()) {
      delete product.stock;
    }
    if ('condition' in product && !product.condition) {
      delete (product as any).condition;
    }
    if ('size' in product && !product.size) {
      delete (product as any).size;
    }
    if ('specialEdition' in product && !product.specialEdition) {
      delete product.specialEdition;
    }
    if (product.format === 'CASSETTE' && !product.condition) {
      this.alertStore.addAlert({
        message: 'Los cassettes deben tener una condición',
        type: 'error',
      });
      this.waiting = false;
      return;
    }
    if (product.format === 'VINYL' && !product.size) {
      this.alertStore.addAlert({
        message: 'Los vinilos deben tener un tamaño',
        type: 'error',
      });
      this.waiting = false;
      return;
    }

    this.productsApi.createDiscography(product).subscribe({
      next: ({ id }) => {
        if (this.image) {
          this.productsApi.addDiscographyCover(id, this.image).subscribe({
            next: () => {
              this.alertStore.addAlert({
                message: 'Se ha creado el producto correctamente',
                type: 'success',
              });
              this.waiting = false;
            },
            error: (error: HttpErrorResponse) => {
              this.alertStore.addAlert({
                message: `Se creo el producto pero no se pudo subir la imagen: ${error.error.message}`,
                type: 'error',
              });
              this.waiting = false;
            },
          });
          return;
        }
        this.alertStore.addAlert({
          message: 'Se ha creado el producto correctamente',
          type: 'success',
        });
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
}
