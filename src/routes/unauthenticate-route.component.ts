import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'unauthenticate-route',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: '<router-outlet />',
})
export class UnauthenticateRouteComponent {
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.isAuthenticated()) {
        const state = this.router.lastSuccessfulNavigation?.extras.state;
        const path = state?.['from'] || '/';

        this.router.navigate([path]);
      }
    });
  }
}
