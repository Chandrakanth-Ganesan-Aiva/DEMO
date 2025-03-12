import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageQtyAllocationComponent } from './storage-qty-allocation.component';

describe('StorageQtyAllocationComponent', () => {
  let component: StorageQtyAllocationComponent;
  let fixture: ComponentFixture<StorageQtyAllocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StorageQtyAllocationComponent]
    });
    fixture = TestBed.createComponent(StorageQtyAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
