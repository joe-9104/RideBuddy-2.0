import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm!: FormGroup;

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.initForm()
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    const { email, password, firstName, lastName, role } = this.registerForm.value;

    if (password !== this.registerForm.value.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    try {
      this.loading = true;
      await this.auth.register(email!, password!, { firstName, lastName, role });
      this.successMessage = 'Account created successfully! Redirecting...';
      this.errorMessage = '';
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (err: any) {
      this.errorMessage = err.message || 'An error occurred.';
    } finally {
      this.loading = false;
    }
  }
}
