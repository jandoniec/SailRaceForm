import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from '../registration.service';
import { ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-captain-form',
  templateUrl: './captain-form.component.html',
  styleUrls: ['./captain-form.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None, 
  imports: [ReactiveFormsModule, CommonModule],
})
export class CaptainFormComponent implements OnInit {
  form!: FormGroup;

  constructor(private registrationService: RegistrationService, private router: Router) {}

  ngOnInit(): void {
    const captainForm = this.registrationService.getForm().get('captain');
    if (captainForm instanceof FormGroup) {
      this.form = captainForm;
    } else {
      throw new Error('Error');
    }
  }

  onNext(): void {
    if (this.form.valid) {
      this.router.navigate(['/crew-form']);
    } else {
      this.form.markAllAsTouched(); // Highlights invalid fields
      alert('Proszę uzupełnić wszystkie pola poprawnie.'); 
    }
  }
}
