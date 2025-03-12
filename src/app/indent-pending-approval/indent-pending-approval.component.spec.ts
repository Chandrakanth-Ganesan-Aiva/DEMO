import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentPendingApprovalComponent } from './indent-pending-approval.component';

describe('IndentPendingApprovalComponent', () => {
  let component: IndentPendingApprovalComponent;
  let fixture: ComponentFixture<IndentPendingApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndentPendingApprovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndentPendingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
