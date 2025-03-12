import { TestBed } from '@angular/core/testing';

import { StoretostoreService } from './storetostore.service';

describe('StoretostoreService', () => {
  let service: StoretostoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoretostoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
