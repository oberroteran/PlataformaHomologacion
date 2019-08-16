import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationRequestComponent } from './quotation-request.component';

describe('QuotationRequestComponent', () => {
  let component: QuotationRequestComponent;
  let fixture: ComponentFixture<QuotationRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
