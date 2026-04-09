import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesInscriptionComponent } from './demandes-inscription.component';

describe('DemandesInscriptionComponent', () => {
  let component: DemandesInscriptionComponent;
  let fixture: ComponentFixture<DemandesInscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandesInscriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandesInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
