import { TestBed } from '@angular/core/testing';

import { TypeVehiculeService } from './type-vehicule.service';

describe('TypeVehiculeService', () => {
  let service: TypeVehiculeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeVehiculeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
