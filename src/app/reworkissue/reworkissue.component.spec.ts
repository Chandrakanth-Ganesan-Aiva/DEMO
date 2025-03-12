import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReworkissueComponent } from './reworkissue.component';

describe('ReworkissueComponent', () => {
  let component: ReworkissueComponent;
  let fixture: ComponentFixture<ReworkissueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReworkissueComponent]
    });
    fixture = TestBed.createComponent(ReworkissueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
