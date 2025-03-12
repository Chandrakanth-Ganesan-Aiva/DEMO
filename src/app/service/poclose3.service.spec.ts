import { TestBed } from '@angular/core/testing';

import { Poclose3Service } from './poclose3.service';

describe('Poclose3Service', () => {
  let service: Poclose3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Poclose3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
