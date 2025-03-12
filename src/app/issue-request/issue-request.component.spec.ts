import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueRequestComponent } from './issue-request.component';

describe('IssueRequestComponent', () => {
  let component: IssueRequestComponent;
  let fixture: ComponentFixture<IssueRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssueRequestComponent]
    });
    fixture = TestBed.createComponent(IssueRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
