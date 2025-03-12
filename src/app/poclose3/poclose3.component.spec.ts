import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Poclose3Component } from './poclose3.component';

describe('Poclose3Component', () => {
  let component: Poclose3Component;
  let fixture: ComponentFixture<Poclose3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Poclose3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Poclose3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
