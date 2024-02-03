import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorContactDetailsComponent } from './vendor-contact-details.component';

describe('VendorContactDetailsComponent', () => {
  let component: VendorContactDetailsComponent;
  let fixture: ComponentFixture<VendorContactDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VendorContactDetailsComponent]
    });
    fixture = TestBed.createComponent(VendorContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
