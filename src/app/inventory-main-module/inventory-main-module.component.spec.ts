import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryMainModuleComponent } from './inventory-main-module.component';

describe('InventoryMainModuleComponent', () => {
  let component: InventoryMainModuleComponent;
  let fixture: ComponentFixture<InventoryMainModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryMainModuleComponent]
    });
    fixture = TestBed.createComponent(InventoryMainModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
