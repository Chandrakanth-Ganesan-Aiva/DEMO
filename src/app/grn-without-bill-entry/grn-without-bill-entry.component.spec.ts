import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnWithoutBillEntryComponent } from './grn-without-bill-entry.component';

describe('GrnWithoutBillEntryComponent', () => {
  let component: GrnWithoutBillEntryComponent;
  let fixture: ComponentFixture<GrnWithoutBillEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrnWithoutBillEntryComponent]
    });
    fixture = TestBed.createComponent(GrnWithoutBillEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
