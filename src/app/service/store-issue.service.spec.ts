import { TestBed } from '@angular/core/testing';

import { StoreIssueService } from './store-issue.service';

describe('StoreIssueService', () => {
  let service: StoreIssueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreIssueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
