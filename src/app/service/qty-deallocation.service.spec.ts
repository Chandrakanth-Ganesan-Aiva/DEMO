import { TestBed } from '@angular/core/testing';

import { QtyDeallocationService } from './qty-deallocation.service';

describe('QtyDeallocationService', () => {
  let service: QtyDeallocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QtyDeallocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
