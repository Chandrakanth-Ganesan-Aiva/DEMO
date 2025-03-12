import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinmumMaximumEntryComponent } from './minmum-maximum-entry.component';

describe('MinmumMaximumEntryComponent', () => {
  let component: MinmumMaximumEntryComponent;
  let fixture: ComponentFixture<MinmumMaximumEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinmumMaximumEntryComponent]
    });
    fixture = TestBed.createComponent(MinmumMaximumEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
