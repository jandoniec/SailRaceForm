import { Routes } from '@angular/router';
import { BoatFormComponent } from './boat-form/boat-form.component';
import { CaptainFormComponent } from './captain-form/captain-form.component';
import { CrewFormComponent } from './crew-form/crew-form.component';
import { SummaryComponent } from './summary/summary.component';

export const routes: Routes = [
  { path: '', redirectTo: 'boat-form', pathMatch: 'full' },
  { path: 'boat-form', component: BoatFormComponent },
  { path: 'captain-form', component: CaptainFormComponent },
  { path: 'crew-form', component: CrewFormComponent },
  { path: 'summary', component: SummaryComponent },
];
