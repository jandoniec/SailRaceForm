import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RegistrationService } from '../registration.service';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  standalone: true,
  encapsulation: ViewEncapsulation.None, 
  imports: [CommonModule],
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  form!: FormGroup;
  raceNumber: string = '';
  errorMessage: string = '';

  constructor(private registrationService: RegistrationService) {}

  ngOnInit(): void {
    try {
      const form = this.registrationService.getForm();
      if (form instanceof FormGroup) {
        this.form = form;
      } else {
        throw new Error('Form is not a FormGroup.');
      }
    } catch (error) {
      console.error('Błąd podczas inicjalizacji formularza:', error);
      this.errorMessage = 'Wystąpił błąd podczas ładowania formularza.';
      return;
    }

    this.generateRaceNumber();
  }

  private async generateRaceNumber(): Promise<void> {
    try {
      const boatLength = this.form.get('boat.length')?.value;
      if (boatLength !== undefined) {
        this.raceNumber = await this.registrationService.generateRaceNumber(boatLength);
      } else {
        throw new Error('Nie podano długości jachtu.');
      }
    } catch (err) {
      console.error('Błąd generowania numeru startowego:', err);
      this.errorMessage = 'Nie udało się wygenerować numeru startowego.';
      this.raceNumber = 'Brak numeru.';
    }
  }
}
