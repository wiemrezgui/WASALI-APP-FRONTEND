import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeLivraisonComponent } from './demande-livraison.component';

describe('DemandeLivraisonComponent', () => {
  let component: DemandeLivraisonComponent;
  let fixture: ComponentFixture<DemandeLivraisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeLivraisonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandeLivraisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
