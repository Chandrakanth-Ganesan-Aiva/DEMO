import { TestBed } from '@angular/core/testing';

import { CapitalPOReviewService } from './capital-poreview.service';

describe('CapitalPOReviewService', () => {
  let service: CapitalPOReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapitalPOReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
