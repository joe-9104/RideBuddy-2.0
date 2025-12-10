import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faMoon, faSun} from '@fortawesome/free-solid-svg-icons';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FaIconComponent,
    NgClass
  ],
  templateUrl: './contact.html',
})
export class Contact implements OnInit {
  contactFrom :  FormGroup<{
    email: FormControl<string>;
    name: FormControl<string>;
    message: FormControl<string>;
  }>;
  loading = false;
  errorMessage = '';
  currentYear = new Date().getFullYear();
  protected isDarkMode: boolean = false;

  constructor(private readonly fb: FormBuilder) {
    this.contactFrom = new FormGroup({
      email: fb.nonNullable.control("", [Validators.required, Validators.email]),
      name: fb.nonNullable.control("", [Validators.required]),
      message: fb.nonNullable.control("", [Validators.required])
    });
  }

  ngOnInit() {
    this.isDarkMode = document.documentElement.classList.contains('dark');
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  onSubmit() {
    console.log(this.contactFrom.value);
  }

  protected readonly faSun = faSun;
  protected readonly faMoon = faMoon;
}
