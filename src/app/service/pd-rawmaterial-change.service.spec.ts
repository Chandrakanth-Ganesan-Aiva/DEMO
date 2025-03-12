import { TestBed } from '@angular/core/testing';

import { PDRawmaterialChangeService } from './pd-rawmaterial-change.service';

describe('PDRawmaterialChangeService', () => {
  let service: PDRawmaterialChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PDRawmaterialChangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
