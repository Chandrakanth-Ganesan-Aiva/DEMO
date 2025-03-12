import { TestBed } from '@angular/core/testing';

import { IssueRequestService } from './issue-request.service';

describe('IssueRequestService', () => {
  let service: IssueRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
