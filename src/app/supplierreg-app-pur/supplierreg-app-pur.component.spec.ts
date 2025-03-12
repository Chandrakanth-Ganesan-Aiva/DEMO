import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierregAppPurComponent } from './supplierreg-app-pur.component';

describe('SupplierregAppPurComponent', () => {
  let component: SupplierregAppPurComponent;
  let fixture: ComponentFixture<SupplierregAppPurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierregAppPurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplierregAppPurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
