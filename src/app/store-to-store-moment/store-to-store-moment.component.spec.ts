import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreToStoreMomentComponent } from './store-to-store-moment.component';

describe('StoreToStoreMomentComponent', () => {
  let component: StoreToStoreMomentComponent;
  let fixture: ComponentFixture<StoreToStoreMomentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreToStoreMomentComponent]
    });
    fixture = TestBed.createComponent(StoreToStoreMomentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
