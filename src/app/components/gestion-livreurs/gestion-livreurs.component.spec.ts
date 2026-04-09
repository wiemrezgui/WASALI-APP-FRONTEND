import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionLivreursComponent } from './gestion-livreurs.component';

describe('GestionLivreursComponent', () => {
  let component: GestionLivreursComponent;
  let fixture: ComponentFixture<GestionLivreursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionLivreursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionLivreursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
