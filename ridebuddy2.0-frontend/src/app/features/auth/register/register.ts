import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faCarSide, faEnvelope, faLock, faLockOpen, faPersonCirclePlus, faUser} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FaIconComponent
  ],
  templateUrl: './register.html',
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

  protected readonly faUser = faUser;
  protected readonly faEnvelope = faEnvelope;
  protected readonly faLock = faLock;
  protected readonly faLockOpen = faLockOpen;
  protected readonly faCarSide = faCarSide;
  protected readonly faPersonCirclePlus = faPersonCirclePlus;
}
