import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawmaterialSplitComponent } from './rawmaterial-split.component';

describe('RawmaterialSplitComponent', () => {
  let component: RawmaterialSplitComponent;
  let fixture: ComponentFixture<RawmaterialSplitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RawmaterialSplitComponent]
    });
    fixture = TestBed.createComponent(RawmaterialSplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
