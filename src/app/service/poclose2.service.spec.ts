import { TestBed } from '@angular/core/testing';

import { Poclose2Service } from './poclose2.service';

describe('Poclose2Service', () => {
  let service: Poclose2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Poclose2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
