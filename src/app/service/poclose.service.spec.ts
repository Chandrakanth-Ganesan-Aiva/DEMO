import { TestBed } from '@angular/core/testing';

import { POCloseService } from './poclose.service';

describe('POCloseService', () => {
  let service: POCloseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(POCloseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
