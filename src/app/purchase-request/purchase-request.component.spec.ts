import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRequestComponent } from './purchase-request.component';

describe('PurchaseRequestComponent', () => {
  let component: PurchaseRequestComponent;
  let fixture: ComponentFixture<PurchaseRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseRequestComponent]
    });
    fixture = TestBed.createComponent(PurchaseRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
