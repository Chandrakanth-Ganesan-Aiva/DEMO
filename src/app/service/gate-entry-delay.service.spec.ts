import { TestBed } from '@angular/core/testing';

import { GateEntryDelayService } from './gate-entry-delay.service';

describe('GateEntryDelayService', () => {
  let service: GateEntryDelayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GateEntryDelayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
