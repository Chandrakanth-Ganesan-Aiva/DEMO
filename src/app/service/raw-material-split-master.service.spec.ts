import { TestBed } from '@angular/core/testing';

import { RawMaterialSplitMasterService } from './raw-material-split-master.service';

describe('RawMaterialSplitMasterService', () => {
  let service: RawMaterialSplitMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RawMaterialSplitMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
