import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthorizationService } from '../Services/authorization.service'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password-step1.component.html',
  styleUrls: ['./forgot-password-step1.component.css']
})
export class ForgotPasswordStep1Component implements OnInit {

  email: string;
  errorMessage: string;
  constructor(private auth: AuthorizationService, public router: Router, ) { }

  ngOnInit() {
  }
  onNext() {
    this.errorMessage = null;
    this.auth.forgotPassword(this.email.toLowerCase()).subscribe((data) => {
      this.router.navigate(['/forgotpassword', this.email.toLowerCase()]);
    }, (err) => {

      this.errorMessage = "Please enter valid e-mail Id."
    });;
  }

}
