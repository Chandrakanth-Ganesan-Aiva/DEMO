import { TestBed } from '@angular/core/testing';

import { SupplierregAppPurService } from './supplierreg-app-pur.service';

describe('SupplierregAppPurService', () => {
  let service: SupplierregAppPurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierregAppPurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
