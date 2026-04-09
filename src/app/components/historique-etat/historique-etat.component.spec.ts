import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueEtatComponent } from './historique-etat.component';

describe('HistoriqueEtatComponent', () => {
  let component: HistoriqueEtatComponent;
  let fixture: ComponentFixture<HistoriqueEtatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueEtatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoriqueEtatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
