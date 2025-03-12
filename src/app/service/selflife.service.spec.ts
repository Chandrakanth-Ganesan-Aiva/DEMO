import { TestBed } from '@angular/core/testing';

import { SelflifeService } from './selflife.service';

describe('SelflifeService', () => {
  let service: SelflifeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelflifeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
