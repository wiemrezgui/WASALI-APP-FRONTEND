import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupLivreurComponent } from './signup-livreur.component';

describe('SignupLivreurComponent', () => {
  let component: SignupLivreurComponent;
  let fixture: ComponentFixture<SignupLivreurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupLivreurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignupLivreurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
