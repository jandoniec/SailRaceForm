import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClient i HttpClientModule

@Component({
  selector: 'app-race-form',
  templateUrl: './race-form.component.html',
  styleUrls: ['./race-form.component.scss'], // Jeśli używasz SCSS
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule] // Dodano HttpClientModule
})
export class RaceFormComponent {
  raceForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.raceForm = this.fb.group({
      boatName: ['', Validators.required],
      boatLength: ['', [Validators.required, Validators.min(1)]],
      boatWidth: ['', [Validators.required, Validators.min(1)]],
      boatDraft: ['', [Validators.required, Validators.min(0.1)]],
      sailArea: ['', [Validators.required, Validators.min(1)]],
      vhfRadio: [false, Validators.requiredTrue],
      safetyGear: [false, Validators.requiredTrue],
      captainName: ['', Validators.required],
      captainEmail: ['', [Validators.required, Validators.email]],
      captainPhone: ['', Validators.required],
      crewSize: ['', [Validators.required, Validators.min(1)]],
      registrationGroup: ['', Validators.required],
      tshirtSizes: this.fb.array([]),
      acceptRules: [false, Validators.requiredTrue],
      acceptImageUse: [false, Validators.requiredTrue],
      raceNumber: [''] // Pole na numer startowy
    });
  }

  get tshirtSizes(): FormArray {
    return this.raceForm.get('tshirtSizes') as FormArray;
  }
  

  onCrewSizeChange(): void {
    const crewSize = this.raceForm.get('crewSize')?.value || 0;
  
    // Synchronizacja liczby grup w FormArray z crewSize
    while (this.tshirtSizes.length < crewSize) {
      this.tshirtSizes.push(this.fb.group({
        size: ['', Validators.required]
      }));
    }
  
    while (this.tshirtSizes.length > crewSize) {
      this.tshirtSizes.removeAt(this.tshirtSizes.length - 1);
    }
  
    console.log('Aktualny stan tshirtSizes:', this.tshirtSizes.value);
  }
  

  generateRaceNumber(): Promise<string> {
    return this.http
      .get('https://www.uuidgenerator.net/api/version4', { responseType: 'text' })
      .toPromise()
      .then(uuid => {
        if (uuid) {
          // Usunięcie białych znaków i konwersja do liczby
          const numericPart = parseInt(uuid.trim().replace(/-/g, '').slice(0, 6), 16); // Wybierz 6 znaków jako liczbę
          const raceNumber = (numericPart % 999) + 1; // Przekształcenie na zakres 1–999
          return raceNumber.toString().padStart(3, '0'); // Formatuj na trzy cyfry
        } else {
          throw new Error('Błąd: Brak danych z API');
        }
      })
      .catch(err => {
        console.error('Błąd pobierania numeru startowego:', err);
        throw new Error('Nie udało się pobrać numeru startowego.');
      });
  }
  
  
  onSubmit(): void {
    if (this.raceForm.valid) {
      this.generateRaceNumber()
        .then(raceNumber => {
          // Aktualizujemy pole `raceNumber` w formularzu
          this.raceForm.get('raceNumber')?.setValue(raceNumber);
  
          // Wyświetlamy alert z numerem startowym
          alert(`Formularz przesłano pomyślnie! Twój numer startowy to: ${raceNumber}`);
        })
        .catch(err => {
          alert('Formularz przesłano pomyślnie, ale nie udało się wygenerować numeru startowego.');
          console.error(err);
        });
    } else {
      alert('Proszę wypełnić wszystkie wymagane pola.');
      const invalidControls = this.findInvalidControls();
      console.log('Nieprawidłowe pola:', invalidControls);
    }
  }
  
  
  
  findInvalidControls(): string[] {
    const invalidControls: string[] = [];
    const controls = this.raceForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalidControls.push(name);
      }
    }
    // Dodaj sprawdzanie `FormArray`
    this.tshirtSizes.controls.forEach((control, index) => {
      if (control.invalid) {
        invalidControls.push(`tshirtSizes[${index}]`);
      }
    });
    return invalidControls;
  }
  

  ngOnInit(): void {
    this.raceForm.get('crewSize')?.valueChanges.subscribe(() => {
      this.onCrewSizeChange();
    });
  }
  
}
