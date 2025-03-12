import { TestBed } from '@angular/core/testing';

import { ShelfLifeRecertificateService } from './shelf-life-recertificate.service';

describe('ShelfLifeRecertificateService', () => {
  let service: ShelfLifeRecertificateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShelfLifeRecertificateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
