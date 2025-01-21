import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from '../registration.service';
import { FormGroup, FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crew-form',
  templateUrl: './crew-form.component.html',
  styleUrls: ['./crew-form.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None, // Pozwala na globalne style
  imports: [ReactiveFormsModule, CommonModule],
})
export class CrewFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private registrationService: RegistrationService,
    private fb: FormBuilder, // Wstrzykujemy FormBuilder
    private router: Router
  ) {}

  ngOnInit(): void {
    const crewForm = this.registrationService.getForm().get('crew');
    if (crewForm instanceof FormGroup) {
      this.form = crewForm;
    } else {
      throw new Error('Error');
    }
  }

  get tshirtSizes(): FormArray {
    return this.form.get('tshirtSizes') as FormArray;
  }

  updateTshirtSizes(): void {
    const size = this.form?.get('size')?.value || 0;
    while (this.tshirtSizes.length < size) {
      this.tshirtSizes.push(
        this.fb.control('', [Validators.required]) 
      );
    }
    while (this.tshirtSizes.length > size) {
      this.tshirtSizes.removeAt(this.tshirtSizes.length - 1);
    }
  }

  onSubmit(): void {
    if (this.form?.valid) {
      this.router.navigate(['/summary']);
    } else {
      this.form.markAllAsTouched(); // Podświetlenie błędnych pól
      alert('Proszę uzupełnić wszystkie pola, w tym rozmiary koszulek.');
    }
  }
}
