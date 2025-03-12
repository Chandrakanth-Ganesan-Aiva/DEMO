import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierregAppFinComponent } from './supplierreg-app-fin.component';

describe('SupplierregAppFinComponent', () => {
  let component: SupplierregAppFinComponent;
  let fixture: ComponentFixture<SupplierregAppFinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierregAppFinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplierregAppFinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
