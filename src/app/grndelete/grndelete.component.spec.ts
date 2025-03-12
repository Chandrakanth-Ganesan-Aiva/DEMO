import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrndeleteComponent } from './grndelete.component';

describe('GrndeleteComponent', () => {
  let component: GrndeleteComponent;
  let fixture: ComponentFixture<GrndeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrndeleteComponent]
    });
    fixture = TestBed.createComponent(GrndeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
