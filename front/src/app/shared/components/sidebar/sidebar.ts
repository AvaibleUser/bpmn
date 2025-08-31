import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarItem } from '@shared/models/sidebar.model';
import { LucideAngularModule, Menu, X } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  readonly Close = X;
  readonly Menu = Menu;

  items = input<SidebarItem[]>();

  collapsed = signal(true);
}
