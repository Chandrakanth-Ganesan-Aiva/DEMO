import { TestBed } from '@angular/core/testing';

import { CODApproveService } from './codapprove.service';

describe('CODApproveService', () => {
  let service: CODApproveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CODApproveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
