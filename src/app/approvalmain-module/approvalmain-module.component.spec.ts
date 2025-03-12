import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalmainModuleComponent } from './approvalmain-module.component';

describe('ApprovalmainModuleComponent', () => {
  let component: ApprovalmainModuleComponent;
  let fixture: ComponentFixture<ApprovalmainModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovalmainModuleComponent]
    });
    fixture = TestBed.createComponent(ApprovalmainModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
