import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationAdminComponent } from './validation-admin.component';

describe('ValidationAdminComponent', () => {
  let component: ValidationAdminComponent;
  let fixture: ComponentFixture<ValidationAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValidationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
