import { CommerceApi } from '@/shop/api/commerce-api';
import { ProductsApi } from '@/shop/api/products-api';
import { Cd } from '@/shop/models/discography.model';
import { Genre } from '@/shop/models/genre.model';
import { GroupType } from '@/shop/models/group.model';
import { CreatePromotion } from '@/shop/models/promotion.model';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertStore } from '@shared/stores/alert-store';
import { LucideAngularModule, Plus, Trash2 } from 'lucide-angular';

@Component({
  selector: 'shop-add-promotion',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './add-promotion.html',
  styles: ``,
})
export class AddPromotion implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly productsApi = inject(ProductsApi);
  private readonly commerceApi = inject(CommerceApi);
  private readonly alertStore = inject(AlertStore);

  readonly Add = Plus;
  readonly Delete = Trash2;

  addForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required, Validators.minLength(2)]],
    startDate: [new Date(), [Validators.required]],
    endDate: [0, []],
    cdIds: this.formBuilder.array([
      this.formBuilder.control(0, [Validators.required, Validators.min(1)]),
    ]),
  });
  groupId = this.formBuilder.control(0, [Validators.required, Validators.min(1)]);
  genreId = this.formBuilder.control(0, [Validators.required, Validators.min(1)]);

  waiting = false;
  groups?: GroupType[];
  cds?: Cd[];
  genres?: Genre[];
  group?: GroupType;

  ngOnInit() {
    this.commerceApi.getGroups().subscribe({
      next: (groups) => {
        this.groups = groups;
      },
    });
    this.productsApi.getGenres().subscribe({
      next: (genres) => {
        this.genres = genres;
      },
    });
  }

  get availableCds() {
    return this.cds?.map((cd) => cd.id).filter((cd) => !this.cdIds.value.includes(cd));
  }

  get cdIds() {
    return this.addForm.get('cdIds') as FormArray;
  }

  addCd() {
    this.cdIds.push(this.formBuilder.control(0, [Validators.required, Validators.min(1)]));
  }

  rmCd(index: number) {
    this.cdIds.removeAt(index);
  }

  clearCds() {
    this.cdIds.clear();
    this.cdIds.push(this.formBuilder.control(0, [Validators.required, Validators.min(1)]));
  }

  changeGroup() {
    this.clearCds();
    this.group = this.groups?.find((group) => group.id === this.groupId.value);
    this.changeGenre();
  }

  changeGenre() {
    this.productsApi
      .getDiscographies({
        genreId: this.genreId.value || undefined,
        size: 1000,
        page: 0,
        format: 'CD',
      })
      .subscribe({
        next: (discographies) => {
          this.cds = discographies.content as Cd[];
        },
      });
  }

  checkField(field: string, index?: number): boolean | undefined {
    if (field === 'groupId') {
      return this.groupId.touched && this.groupId.invalid;
    }
    if (field === 'genreId') {
      return this.genreId.touched && this.genreId.invalid;
    }
    if (field === 'cdIds' && index !== undefined) {
      return this.cdIds.at(index)?.touched && this.cdIds.at(index)?.invalid;
    }
    return this.addForm.get(field)?.touched && this.addForm.get(field)?.invalid;
  }

  addPromotion() {
    this.waiting = true;
    if (this.addForm.invalid || this.groupId.invalid) {
      this.alertStore.addAlert({
        message: 'Revisa los campos inválidos',
        type: 'error',
      });
      this.waiting = false;
      return;
    }

    const promotion: CreatePromotion = this.addForm.getRawValue();
    const groupId = this.groupId.getRawValue();
    if (this.group?.limitedTime) {
      if (!this.addForm.get('endDate')?.value) {
        this.alertStore.addAlert({
          message: 'Se debe ingresar la fecha de finalización de la promoción',
          type: 'error',
        });
        this.waiting = false;
        return;
      }
    } else {
      delete promotion.endDate;
    }
    if (!groupId) {
      this.alertStore.addAlert({
        message: 'Revisa los campos inválidos',
        type: 'error',
      });
      this.waiting = false;
      return;
    }
    this.commerceApi.createPromotion(groupId, promotion).subscribe({
      next: () => {
        this.alertStore.addAlert({
          message: 'Promoción creada',
          type: 'success',
        });
        this.waiting = false;
      },
      error: (error) => {
        this.alertStore.addAlert({
          message: error.error.message,
          type: 'error',
        });
        this.waiting = false;
      },
    });
  }
}
