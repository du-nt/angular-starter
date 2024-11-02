import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { AuthService, TokenBulk } from '../../services/auth.service';
import { QueryService } from '../../services/query.service';
import { Profile } from '../app.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  queryService = inject(QueryService);
  authService = inject(AuthService);
  queryClient = injectQueryClient();

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  profile = this.queryService.query<Profile>(() => ({
    queryKey: ['profile'],
    enabled: false,
    onSuccess: () => {
      this.authService.authenticate();
    },
  }));

  login = this.queryService.mutation<TokenBulk>(() => ({
    endpoint: 'login',
    onSuccess: async (tokens) => {
      this.authService.setTokens(tokens);
      await this.profile.refetch();
      // Show toast message
    },
  }));

  handleSubmit() {
    if (!this.loginForm.valid) return;

    this.queryClient.removeQueries();

    this.login.mutate(this.loginForm.value);
  }
}
