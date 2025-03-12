import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfLifeRecertificateComponent } from './shelf-life-recertificate.component';

describe('ShelfLifeRecertificateComponent', () => {
  let component: ShelfLifeRecertificateComponent;
  let fixture: ComponentFixture<ShelfLifeRecertificateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShelfLifeRecertificateComponent]
    });
    fixture = TestBed.createComponent(ShelfLifeRecertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
