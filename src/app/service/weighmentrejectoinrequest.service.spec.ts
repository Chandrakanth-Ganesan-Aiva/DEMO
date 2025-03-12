import { TestBed } from '@angular/core/testing';

import { WeighmentrejectoinrequestService } from './weighmentrejectoinrequest.service';

describe('WeighmentrejectoinrequestService', () => {
  let service: WeighmentrejectoinrequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeighmentrejectoinrequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
