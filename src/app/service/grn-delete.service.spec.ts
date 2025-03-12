import { TestBed } from '@angular/core/testing';

import { GrnDeleteService } from './grn-delete.service';

describe('GrnDeleteService', () => {
  let service: GrnDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrnDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
