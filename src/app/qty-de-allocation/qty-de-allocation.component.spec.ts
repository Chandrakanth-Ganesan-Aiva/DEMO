import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QtyDeAllocationComponent } from './qty-de-allocation.component';

describe('QtyDeAllocationComponent', () => {
  let component: QtyDeAllocationComponent;
  let fixture: ComponentFixture<QtyDeAllocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QtyDeAllocationComponent]
    });
    fixture = TestBed.createComponent(QtyDeAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
