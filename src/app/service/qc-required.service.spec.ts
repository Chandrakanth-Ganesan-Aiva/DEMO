import { TestBed } from '@angular/core/testing';

import { QcRequiredService } from './qc-required.service';

describe('QcRequiredService', () => {
  let service: QcRequiredService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QcRequiredService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
