import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeighmentDelayApprComponent } from './weighment-delay-appr.component';

describe('WeighmentDelayApprComponent', () => {
  let component: WeighmentDelayApprComponent;
  let fixture: ComponentFixture<WeighmentDelayApprComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeighmentDelayApprComponent]
    });
    fixture = TestBed.createComponent(WeighmentDelayApprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
