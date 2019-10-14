import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyVoucherComponent } from './policy-voucher.component';

describe('PolicyVoucherComponent', () => {
  let component: PolicyVoucherComponent;
  let fixture: ComponentFixture<PolicyVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
