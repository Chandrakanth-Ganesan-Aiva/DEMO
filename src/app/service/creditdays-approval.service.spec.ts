import { TestBed } from '@angular/core/testing';

import { CreditdaysApprovalService } from './creditdays-approval.service';

describe('CreditdaysApprovalService', () => {
  let service: CreditdaysApprovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditdaysApprovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
