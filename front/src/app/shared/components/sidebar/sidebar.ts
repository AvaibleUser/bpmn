import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Role } from '@core/auth/models/auth.model';
import { SidebarItem } from '@shared/models/sidebar.model';
import { AuthStore } from '@shared/stores/auth-store';
import { LucideAngularModule, Menu, X } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  private readonly authStore = inject(AuthStore);

  readonly Close = X;
  readonly Menu = Menu;

  role?: Role;
  items = input<SidebarItem[]>();

  collapsed = signal(true);

  constructor() {
    effect(() => {
      this.role = this.authStore.session().token ? this.authStore.session().role : undefined;
    });
  }
}
