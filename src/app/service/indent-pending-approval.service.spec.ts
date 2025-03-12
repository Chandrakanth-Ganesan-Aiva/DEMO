import { TestBed } from '@angular/core/testing';

import { IndentPendingApprovalService } from './indent-pending-approval.service';

describe('IndentPendingApprovalService', () => {
  let service: IndentPendingApprovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndentPendingApprovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
