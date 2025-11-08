import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {firstValueFrom, isObservable} from 'rxjs';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  loginForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      password: this.fb.nonNullable.control('', [Validators.required]),
    });
  }

  async onSubmit() {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill all required fields with valid values.';
      return;
    }

    const { email, password } = this.loginForm.value as { email: string; password: string };

    try {
      this.loading = true;
      const res = this.auth.login(email!, password!);

      // AuthService.login may return a Promise or an Observable.
      if (isObservable(res)) {
        await firstValueFrom(res);
      } else {
        // assume Promise
        await res;
      }

      // successful login -> redirect (change target route if needed)
      await this.router.navigate(['/dashboard']);
    } catch (err: any) {
      // Map common firebase errors to friendly messages (you can extend)
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        this.errorMessage = 'Invalid email or password.';
      } else if (code === 'auth/too-many-requests') {
        this.errorMessage = 'Too many attempts. Try again later.';
      } else {
        this.errorMessage = err?.message || 'Login failed. Please try again.';
      }
    } finally {
      this.loading = false;
    }
  }
}
