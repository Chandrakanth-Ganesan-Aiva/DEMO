import { TestBed } from '@angular/core/testing';

import { WeighprintoutDaimlrService } from './weighprintout-daimlr.service';

describe('WeighprintoutDaimlrService', () => {
  let service: WeighprintoutDaimlrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeighprintoutDaimlrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
