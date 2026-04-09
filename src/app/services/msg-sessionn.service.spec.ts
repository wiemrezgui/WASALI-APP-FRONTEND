import { TestBed } from '@angular/core/testing';

import { MsgSessionnService } from './msg-sessionn.service';

describe('MsgSessionnService', () => {
  let service: MsgSessionnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsgSessionnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
