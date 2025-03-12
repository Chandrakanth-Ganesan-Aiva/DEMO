import { TestBed } from '@angular/core/testing';

import { ReworkissueService } from './reworkissue.service';

describe('ReworkissueService', () => {
  let service: ReworkissueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReworkissueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
