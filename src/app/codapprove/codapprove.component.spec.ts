import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CODApproveComponent } from './codapprove.component';

describe('CODApproveComponent', () => {
  let component: CODApproveComponent;
  let fixture: ComponentFixture<CODApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CODApproveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CODApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
