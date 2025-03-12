import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectIndentComponent } from './direct-indent.component';

describe('DirectIndentComponent', () => {
  let component: DirectIndentComponent;
  let fixture: ComponentFixture<DirectIndentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectIndentComponent]
    });
    fixture = TestBed.createComponent(DirectIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
