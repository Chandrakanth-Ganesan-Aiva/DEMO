import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRejdialogComponent } from './customer-rejdialog.component';

describe('CustomerRejdialogComponent', () => {
  let component: CustomerRejdialogComponent;
  let fixture: ComponentFixture<CustomerRejdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerRejdialogComponent]
    });
    fixture = TestBed.createComponent(CustomerRejdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
