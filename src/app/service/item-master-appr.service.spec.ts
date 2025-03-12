import { TestBed } from '@angular/core/testing';

import { ItemMasterApprService } from './item-master-appr.service';

describe('ItemMasterApprService', () => {
  let service: ItemMasterApprService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemMasterApprService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
