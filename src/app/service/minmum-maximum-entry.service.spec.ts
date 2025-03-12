import { TestBed } from '@angular/core/testing';

import { MinmumMaximumEntryService } from './minmum-maximum-entry.service';

describe('MinmumMaximumEntryService', () => {
  let service: MinmumMaximumEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinmumMaximumEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
