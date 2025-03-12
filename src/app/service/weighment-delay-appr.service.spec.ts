import { TestBed } from '@angular/core/testing';

import { WeighmentDelayApprService } from './weighment-delay-appr.service';

describe('WeighmentDelayApprService', () => {
  let service: WeighmentDelayApprService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeighmentDelayApprService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
