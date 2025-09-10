import { WritableSignal } from '@angular/core';

export type Nullable<T> = { [P in keyof T]?: T[P] | null | undefined };

export type Filter<T extends object> = Nullable<T>;

export type Pageable<T extends object> = Filter<T> & {
  page?: number;
  size?: number;
  sort?: string[];
};

export type Page<T extends object> = {
  content: T[];
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
};

export class WithPage<T extends object> {
  isLastPage(page: Page<T>): boolean {
    return page.page.number <= page.page.totalPages - 1;
  }

  isFirstPage(page: Page<T>): boolean {
    return page.page.number <= 0;
  }

  onPrevious(pageInfo: Page<T>, page: WritableSignal<number>): void {
    if (!this.isFirstPage(pageInfo)) {
      page.update((p) => p - 1);
    }
  }

  onNext(pageInfo: Page<T>, page: WritableSignal<number>): void {
    if (!this.isLastPage(pageInfo)) {
      page.update((p) => p + 1);
    }
  }
}
