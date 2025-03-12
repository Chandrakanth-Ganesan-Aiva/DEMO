import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitalPOReviewComponent } from './capital-poreview.component';

describe('CapitalPOReviewComponent', () => {
  let component: CapitalPOReviewComponent;
  let fixture: ComponentFixture<CapitalPOReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapitalPOReviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CapitalPOReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
