import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateEntryDelayApprComponent } from './gate-entry-delay-appr.component';

describe('GateEntryDelayApprComponent', () => {
  let component: GateEntryDelayApprComponent;
  let fixture: ComponentFixture<GateEntryDelayApprComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GateEntryDelayApprComponent]
    });
    fixture = TestBed.createComponent(GateEntryDelayApprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
