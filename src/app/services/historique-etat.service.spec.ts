import { TestBed } from '@angular/core/testing';

import { HistoriqueEtatService } from './historique-etat.service';

describe('HistoriqueEtatService', () => {
  let service: HistoriqueEtatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriqueEtatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
