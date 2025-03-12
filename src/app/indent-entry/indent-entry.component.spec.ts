import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentEntryComponent } from './indent-entry.component';

describe('IndentEntryComponent', () => {
  let component: IndentEntryComponent;
  let fixture: ComponentFixture<IndentEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndentEntryComponent]
    });
    fixture = TestBed.createComponent(IndentEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
