import { TestBed } from '@angular/core/testing';

import { SupplierregAppFinService } from './supplierreg-app-fin.service';

describe('SupplierregAppFinService', () => {
  let service: SupplierregAppFinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierregAppFinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
