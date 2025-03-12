import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreIssueComponent } from './store-issue.component';

describe('StoreIssueComponent', () => {
  let component: StoreIssueComponent;
  let fixture: ComponentFixture<StoreIssueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreIssueComponent]
    });
    fixture = TestBed.createComponent(StoreIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
