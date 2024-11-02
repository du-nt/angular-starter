import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { QueryService } from '../services/query.service';

export type Profile = {
  username: string;
  city: string;
  email: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  queryService = inject(QueryService);
  authService = inject(AuthService);

  profile = this.queryService.query<Profile>(() => ({
    queryKey: ['profile'],
    onSuccess: () => {
      this.authService.authenticate();
    },
  }));
}
