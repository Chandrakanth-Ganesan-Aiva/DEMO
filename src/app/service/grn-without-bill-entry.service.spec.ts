import { TestBed } from '@angular/core/testing';

import { GrnWithoutBillEntryService } from './grn-without-bill-entry.service';

describe('GrnWithoutBillEntryService', () => {
  let service: GrnWithoutBillEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrnWithoutBillEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
