import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private form: FormGroup;
  private raceNumber: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      boat: this.fb.group({
        name: ['', Validators.required], 
        length: ['', [Validators.required, Validators.min(1)]], 
        width: ['', [Validators.required, Validators.min(1)]], 
        draft: ['', [Validators.required, Validators.min(0.1)]], 
        insuranceNumber: ['', Validators.required],
        insuranceProvider: ['', Validators.required],
        insuranceExpiry: ['', Validators.required],
      }),
      captain: this.fb.group({
        name: ['', Validators.required], 
        email: ['', [Validators.required, Validators.email]], 
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{9,15}$')]],
        clubAffiliation: ['', Validators.required],

      }),
      crew: this.fb.group({
        size: ['', [Validators.required, Validators.min(1)]], 
        tshirtSizes: this.fb.array([]), 
      }),
    });
  }

  getForm(): FormGroup {
    return this.form;
  }

  generateRaceNumber(boatLength: number): Promise<string> {
    return this.http
      .get('https://www.uuidgenerator.net/api/version4', { responseType: 'text' })
      .toPromise()
      .then(uuid => {
        if (uuid) {
          const numericPart = parseInt(uuid.trim().replace(/-/g, '').slice(0, 6), 16);
  
          let raceNumber;
          if (boatLength <= 8.01) {
            raceNumber = (numericPart % 100) + 1; 
          } else {
            raceNumber = (numericPart % 100) + 101;
          }
  
          this.raceNumber = raceNumber.toString().padStart(3, '0');
          return this.raceNumber;
        } else {
          throw new Error('Błąd: Brak danych z API');
        }
      })
      .catch(err => {
        console.error('Błąd pobierania numeru startowego:', err);
        throw new Error('Nie udało się pobrać numeru startowego.');
      });
  }
  

  getRaceNumber(): string {
    return this.raceNumber;
  }
}