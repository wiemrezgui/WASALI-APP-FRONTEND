import { TestBed } from '@angular/core/testing';

import { IntervalleDistanceService } from './intervalle-distance.service';

describe('IntervalleDistanceService', () => {
  let service: IntervalleDistanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntervalleDistanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
