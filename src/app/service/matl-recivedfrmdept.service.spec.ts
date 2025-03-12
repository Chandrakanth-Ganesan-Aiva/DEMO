import { TestBed } from '@angular/core/testing';

import { MatlRecivedfrmdeptService } from './matl-recivedfrmdept.service';

describe('MatlRecivedfrmdeptService', () => {
  let service: MatlRecivedfrmdeptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatlRecivedfrmdeptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
