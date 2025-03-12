import { TestBed } from '@angular/core/testing';

import { GrnEntryService } from './grn-entry.service';

describe('GrnEntryService', () => {
  let service: GrnEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrnEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
