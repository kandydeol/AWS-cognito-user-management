import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordStep1Component } from './forgot-password-step1.component';

describe('ForgotPasswordStep1Component', () => {
  let component: ForgotPasswordStep1Component;
  let fixture: ComponentFixture<ForgotPasswordStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
