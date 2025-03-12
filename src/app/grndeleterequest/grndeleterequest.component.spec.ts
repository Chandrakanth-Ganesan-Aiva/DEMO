import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrndeleterequestComponent } from './grndeleterequest.component';

describe('GrndeleterequestComponent', () => {
  let component: GrndeleterequestComponent;
  let fixture: ComponentFixture<GrndeleterequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrndeleterequestComponent]
    });
    fixture = TestBed.createComponent(GrndeleterequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
