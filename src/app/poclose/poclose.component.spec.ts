import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POCloseComponent } from './poclose.component';

describe('POCloseComponent', () => {
  let component: POCloseComponent;
  let fixture: ComponentFixture<POCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [POCloseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(POCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
