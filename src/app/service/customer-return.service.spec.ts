import { TestBed } from '@angular/core/testing';

import { CustomerReturnService } from './customer-return.service';

describe('CustomerReturnService', () => {
  let service: CustomerReturnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerReturnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
