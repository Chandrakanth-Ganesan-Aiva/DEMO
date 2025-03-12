import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerReturnComponent } from './customer-return.component';

describe('CustomerReturnComponent', () => {
  let component: CustomerReturnComponent;
  let fixture: ComponentFixture<CustomerReturnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerReturnComponent]
    });
    fixture = TestBed.createComponent(CustomerReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
