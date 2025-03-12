import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialReturnFrmDeptComponent } from './material-return-frm-dept.component';

describe('MaterialReturnFrmDeptComponent', () => {
  let component: MaterialReturnFrmDeptComponent;
  let fixture: ComponentFixture<MaterialReturnFrmDeptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialReturnFrmDeptComponent]
    });
    fixture = TestBed.createComponent(MaterialReturnFrmDeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
