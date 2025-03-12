import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearingApprovalComponent } from './clearing-approval.component';

describe('ClearingApprovalComponent', () => {
  let component: ClearingApprovalComponent;
  let fixture: ComponentFixture<ClearingApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClearingApprovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClearingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
