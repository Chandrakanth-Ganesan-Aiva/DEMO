import { TestBed } from '@angular/core/testing';

import { ClearingApprovalService } from './clearing-approval.service';

describe('ClearingApprovalService', () => {
  let service: ClearingApprovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClearingApprovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
