import { TestBed } from '@angular/core/testing';

import { SupplierregApprovalTecService } from './supplierreg-approval-tec.service';

describe('SupplierregApprovalTecService', () => {
  let service: SupplierregApprovalTecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierregApprovalTecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
