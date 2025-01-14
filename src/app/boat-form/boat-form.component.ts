import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from '../registration.service';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-boat-form',
  templateUrl: './boat-form.component.html',
  styleUrls: ['./boat-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class BoatFormComponent implements OnInit {
  form!: FormGroup;

  constructor(private registrationService: RegistrationService, private router: Router) {}

  ngOnInit(): void {
    const boatForm = this.registrationService.getForm().get('boat');
    if (boatForm instanceof FormGroup) {
      this.form = boatForm;
    } else {
      throw new Error('Boat form is not a FormGroup.');
    }
  }

  onNext(): void {
    if (this.form.valid) {
      this.router.navigate(['/captain-form']);
    } else {
      alert('Proszę uzupełnić wszystkie pola.');
    }
  }
}
