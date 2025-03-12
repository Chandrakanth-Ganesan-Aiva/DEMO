import { TestBed } from '@angular/core/testing';

import { PackingWeightService } from './packing-weight.service';

describe('PackingWeightService', () => {
  let service: PackingWeightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackingWeightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
