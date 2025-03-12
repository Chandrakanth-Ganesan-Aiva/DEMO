import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfLifeBatchQtyComponent } from './shelf-life-batch-qty.component';

describe('ShelfLifeBatchQtyComponent', () => {
  let component: ShelfLifeBatchQtyComponent;
  let fixture: ComponentFixture<ShelfLifeBatchQtyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShelfLifeBatchQtyComponent]
    });
    fixture = TestBed.createComponent(ShelfLifeBatchQtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
