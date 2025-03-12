import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeighPrintDaimlrComponent } from './weigh-print-daimlr.component';

describe('WeighPrintDaimlrComponent', () => {
  let component: WeighPrintDaimlrComponent;
  let fixture: ComponentFixture<WeighPrintDaimlrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeighPrintDaimlrComponent]
    });
    fixture = TestBed.createComponent(WeighPrintDaimlrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
