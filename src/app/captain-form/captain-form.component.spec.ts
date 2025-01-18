import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptainFormComponent } from './captain-form.component';

describe('CaptainFormComponent', () => {
  let component: CaptainFormComponent;
  let fixture: ComponentFixture<CaptainFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaptainFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptainFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
