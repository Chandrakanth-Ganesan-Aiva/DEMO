import { TestBed } from '@angular/core/testing';

import { StorageQtyAllocationService } from './storage-qty-allocation.service';

describe('StorageQtyAllocationService', () => {
  let service: StorageQtyAllocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageQtyAllocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
