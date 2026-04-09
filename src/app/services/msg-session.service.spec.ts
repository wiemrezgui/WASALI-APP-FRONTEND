import { TestBed } from '@angular/core/testing';

import { MsgSessionService } from './msg-session.service';

describe('MsgSessionService', () => {
  let service: MsgSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsgSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
