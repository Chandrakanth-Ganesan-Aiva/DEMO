import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseMainModuleComponent } from './purchase-main-module.component';

describe('PurchaseMainModuleComponent', () => {
  let component: PurchaseMainModuleComponent;
  let fixture: ComponentFixture<PurchaseMainModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseMainModuleComponent]
    });
    fixture = TestBed.createComponent(PurchaseMainModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
