import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailNumberUpdateComponent } from './mail-number-update.component';

describe('MailNumberUpdateComponent', () => {
  let component: MailNumberUpdateComponent;
  let fixture: ComponentFixture<MailNumberUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailNumberUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MailNumberUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
