import { TestBed } from '@angular/core/testing';

import { DirectIndentService } from './direct-indent.service';

describe('DirectIndentService', () => {
  let service: DirectIndentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirectIndentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
