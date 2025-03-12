import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PDRawmaterialChangeComponent } from './pd-rawmaterial-change.component';

describe('PDRawmaterialChangeComponent', () => {
  let component: PDRawmaterialChangeComponent;
  let fixture: ComponentFixture<PDRawmaterialChangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PDRawmaterialChangeComponent]
    });
    fixture = TestBed.createComponent(PDRawmaterialChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
