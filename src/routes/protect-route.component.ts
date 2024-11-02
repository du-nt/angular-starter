import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'protect-route',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: '<router-outlet />',
})
export class ProtectRouteComponent {
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/login'], { state: { from: this.router.url } });
      }
    });
  }
}
