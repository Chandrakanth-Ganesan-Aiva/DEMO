import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeighmentRejectionRequestComponent } from './weighment-rejection-request.component';

describe('WeighmentRejectionRequestComponent', () => {
  let component: WeighmentRejectionRequestComponent;
  let fixture: ComponentFixture<WeighmentRejectionRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeighmentRejectionRequestComponent]
    });
    fixture = TestBed.createComponent(WeighmentRejectionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
