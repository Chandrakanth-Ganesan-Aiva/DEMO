import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierregApprovalTecComponent } from './supplierreg-approval-tec.component';

describe('SupplierregApprovalTecComponent', () => {
  let component: SupplierregApprovalTecComponent;
  let fixture: ComponentFixture<SupplierregApprovalTecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierregApprovalTecComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplierregApprovalTecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
