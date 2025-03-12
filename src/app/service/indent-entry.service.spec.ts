import { TestBed } from '@angular/core/testing';

import { IndentEntryService } from './indent-entry.service';

describe('IndentEntryService', () => {
  let service: IndentEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndentEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
