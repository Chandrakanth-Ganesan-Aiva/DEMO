import { TestBed } from '@angular/core/testing';

import { WeighmentRejApprService } from './weighment-rej-appr.service';

describe('WeighmentRejApprService', () => {
  let service: WeighmentRejApprService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeighmentRejApprService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
