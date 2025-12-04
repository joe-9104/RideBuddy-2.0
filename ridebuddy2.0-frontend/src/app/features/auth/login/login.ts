import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {User} from '../../../app.models';
import {doc, Firestore, getDoc} from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private firestore:Firestore) {
    this.loginForm = this.fb.group({
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      password: this.fb.nonNullable.control('', [Validators.required]),
    });
  }

  onSubmit() {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }
    const { email, password } = this.loginForm.value;
    this.loading = true;

    this.auth.login(email!, password!)
      .then((userCred) => {
        getDoc(doc(this.firestore, 'users', userCred.user.uid) ).then(
          (docSnap) => {
            const userData = docSnap.data() as Partial<User>;
            this.auth.userSubject.next({
              uid: userCred.user.uid,
              email: userCred.user.email!,
              displayName: userCred.user.displayName ?? '',
              role: userData.role as 'CONDUCTOR' | 'PASSENGER' || 'PASSENGER',
              completedRides: userData.completedRides || 0,
              averageRating: userData.averageRating || 0,
              totalEarnings: userData.totalEarnings || 0
            })
            this.router.navigate(['/dashboard']);
          }
        ).catch((err) => console.error('Error fetching user data:', err));
      })
      .catch((err) => {
        const code = err?.code ?? '';

        if (code === 'auth/user-not-found' || code === 'auth/wrong-password') {
          this.errorMessage = 'Invalid email or password.';
        } else if (code === 'auth/too-many-requests') {
          this.errorMessage = 'Too many attempts. Try again later.';
        } else {
          this.errorMessage = err?.message || 'Login failed.';
        }
      }).finally(() => this.loading = false);
  }

}
