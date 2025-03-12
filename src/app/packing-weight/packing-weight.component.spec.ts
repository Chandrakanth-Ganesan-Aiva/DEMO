import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingWeightComponent } from './packing-weight.component';

describe('PackingWeightComponent', () => {
  let component: PackingWeightComponent;
  let fixture: ComponentFixture<PackingWeightComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackingWeightComponent]
    });
    fixture = TestBed.createComponent(PackingWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
