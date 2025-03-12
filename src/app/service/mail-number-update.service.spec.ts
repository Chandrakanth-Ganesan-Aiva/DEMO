import { TestBed } from '@angular/core/testing';

import { MailNumberUpdateService } from './mail-number-update.service';

describe('MailNumberUpdateService', () => {
  let service: MailNumberUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MailNumberUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
