import { TestBed } from '@angular/core/testing';

import { GrnWithoutBillEntryApprService } from './grn-without-bill-entry-appr.service';

describe('GrnWithoutBillEntryApprService', () => {
  let service: GrnWithoutBillEntryApprService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrnWithoutBillEntryApprService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
