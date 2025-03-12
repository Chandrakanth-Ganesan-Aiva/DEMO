import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamblesComponent } from './exambles.component';

describe('ExamblesComponent', () => {
  let component: ExamblesComponent;
  let fixture: ComponentFixture<ExamblesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamblesComponent]
    });
    fixture = TestBed.createComponent(ExamblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
