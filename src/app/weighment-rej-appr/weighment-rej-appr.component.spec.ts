import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeighmentRejApprComponent } from './weighment-rej-appr.component';

describe('WeighmentRejApprComponent', () => {
  let component: WeighmentRejApprComponent;
  let fixture: ComponentFixture<WeighmentRejApprComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeighmentRejApprComponent]
    });
    fixture = TestBed.createComponent(WeighmentRejApprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
