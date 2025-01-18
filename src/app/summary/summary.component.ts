import { Component, OnInit, ViewEncapsulation , ElementRef, ViewChild} from '@angular/core';
import { RegistrationService } from '../registration.service';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  @ViewChild('summaryContent', { static: false }) summaryContent!: ElementRef;
  showPopup = false;

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

  submitForm(): void {
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }

  async downloadPdf(): Promise<void> {
    if (this.summaryContent) {
      const element = this.summaryContent.nativeElement;
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      doc.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      doc.save('podsumowanie.pdf');
    } else {
      console.error('Nie znaleziono elementu do wygenerowania PDF.');
    }
  }
}