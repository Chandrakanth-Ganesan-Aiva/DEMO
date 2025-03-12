import { TestBed } from '@angular/core/testing';

import { GrndeleterequestService } from './grndeleterequest.service';

describe('GrndeleterequestService', () => {
  let service: GrndeleterequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrndeleterequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
