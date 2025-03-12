import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreissuelogoutComponent } from './storeissuelogout.component';

describe('StoreissuelogoutComponent', () => {
  let component: StoreissuelogoutComponent;
  let fixture: ComponentFixture<StoreissuelogoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreissuelogoutComponent]
    });
    fixture = TestBed.createComponent(StoreissuelogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
