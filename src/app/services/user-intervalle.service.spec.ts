import { TestBed } from '@angular/core/testing';

import { UserIntervalleService } from './user-intervalle.service';

describe('UserIntervalleService', () => {
  let service: UserIntervalleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserIntervalleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
