import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnWithoutBillENtryApprComponent } from './grn-without-bill-entry-appr.component';

describe('GrnWithoutBillENtryApprComponent', () => {
  let component: GrnWithoutBillENtryApprComponent;
  let fixture: ComponentFixture<GrnWithoutBillENtryApprComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrnWithoutBillENtryApprComponent]
    });
    fixture = TestBed.createComponent(GrnWithoutBillENtryApprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
