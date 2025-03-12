import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcRequiredComponent } from './qc-required.component';

describe('QcRequiredComponent', () => {
  let component: QcRequiredComponent;
  let fixture: ComponentFixture<QcRequiredComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QcRequiredComponent]
    });
    fixture = TestBed.createComponent(QcRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
