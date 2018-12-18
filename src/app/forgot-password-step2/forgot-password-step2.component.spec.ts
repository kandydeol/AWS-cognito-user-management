import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordStep2Component } from './forgot-password-step2.component';

describe('ForgotPasswordStep2Component', () => {
  let component: ForgotPasswordStep2Component;
  let fixture: ComponentFixture<ForgotPasswordStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordStep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
