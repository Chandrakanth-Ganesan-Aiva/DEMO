import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Poclose2Component } from './poclose2.component';

describe('Poclose2Component', () => {
  let component: Poclose2Component;
  let fixture: ComponentFixture<Poclose2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Poclose2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Poclose2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
