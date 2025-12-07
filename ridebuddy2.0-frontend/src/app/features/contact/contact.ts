import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  contactFrom :  FormGroup<{
    email: FormControl<string>;
    name: FormControl<string>;
    message: FormControl<string>;
  }>;
  loading = false;
  errorMessage = '';

  constructor(private readonly fb: FormBuilder) {
    this.contactFrom = new FormGroup({
      email: fb.nonNullable.control("", [Validators.required, Validators.email]),
      name: fb.nonNullable.control("", [Validators.required]),
      message: fb.nonNullable.control("", [Validators.required])
    });
  }

  onSubmit() {
    console.log(this.contactFrom.value);
  }

}
