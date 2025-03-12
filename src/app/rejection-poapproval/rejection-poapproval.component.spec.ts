import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionPOApprovalComponent } from './rejection-poapproval.component';

describe('RejectionPOApprovalComponent', () => {
  let component: RejectionPOApprovalComponent;
  let fixture: ComponentFixture<RejectionPOApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectionPOApprovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RejectionPOApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
