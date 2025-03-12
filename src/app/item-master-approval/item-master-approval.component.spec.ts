import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMasterApprovalComponent } from './item-master-approval.component';

describe('ItemMasterApprovalComponent', () => {
  let component: ItemMasterApprovalComponent;
  let fixture: ComponentFixture<ItemMasterApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemMasterApprovalComponent]
    });
    fixture = TestBed.createComponent(ItemMasterApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
