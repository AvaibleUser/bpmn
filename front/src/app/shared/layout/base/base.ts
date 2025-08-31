import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Navbar } from '@shared/components/navbar/navbar';
import { Sidebar } from '@shared/components/sidebar/sidebar';
import { SidebarItem } from '@shared/models/sidebar.model';

@Component({
  selector: 'app-base',
  imports: [CommonModule, RouterModule, Navbar, Sidebar],
  templateUrl: './base.html',
})
export class Base implements OnInit {
  private readonly activateRoute = inject(ActivatedRoute);

  sidebarItems?: SidebarItem[];
  module?: string;
  baseUrl?: string;

  ngOnInit(): void {
    const data = this.activateRoute.snapshot.children.filter((c) => c.data).pop()?.data;
    this.sidebarItems = data?.['sidebarItems'];
    this.module = data?.['module'];
    this.baseUrl = data?.['baseUrl'];
  }
}
