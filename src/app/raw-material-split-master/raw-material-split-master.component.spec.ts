import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialSplitMasterComponent } from './raw-material-split-master.component';

describe('RawMaterialSplitMasterComponent', () => {
  let component: RawMaterialSplitMasterComponent;
  let fixture: ComponentFixture<RawMaterialSplitMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RawMaterialSplitMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RawMaterialSplitMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
