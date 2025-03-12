import { TestBed } from '@angular/core/testing';

import { RejectionPOApprovalService } from './rejection-poapproval.service';

describe('RejectionPOApprovalService', () => {
  let service: RejectionPOApprovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RejectionPOApprovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
