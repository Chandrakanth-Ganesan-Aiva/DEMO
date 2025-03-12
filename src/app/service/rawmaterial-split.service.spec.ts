import { TestBed } from '@angular/core/testing';

import { RawmaterialSplitService } from './rawmaterial-split.service';

describe('RawmaterialSplitService', () => {
  let service: RawmaterialSplitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RawmaterialSplitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
