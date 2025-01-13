import { Component } from '@angular/core';
import { RaceFormComponent } from './race-form/race-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RaceFormComponent] // Dodaj RaceFormComponent tutaj
})
export class AppComponent {
  title = 'regatta-form';
}
