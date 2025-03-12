import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateEntryDelayComponent } from './gate-entry-delay.component';

describe('GateEntryDelayComponent', () => {
  let component: GateEntryDelayComponent;
  let fixture: ComponentFixture<GateEntryDelayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GateEntryDelayComponent]
    });
    fixture = TestBed.createComponent(GateEntryDelayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
