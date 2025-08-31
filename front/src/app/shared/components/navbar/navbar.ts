import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStore } from '@shared/stores/auth-store';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
})
export class Navbar {
  readonly authStore = inject(AuthStore);

  baseUrl = input<string>();
  module = input<string>();
}
