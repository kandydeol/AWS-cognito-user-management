import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { AuthorizationService } from '../Services/authorization.service'
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-forgot-password-step2',
  templateUrl: './forgot-password-step2.component.html',
  styleUrls: ['./forgot-password-step2.component.css']
})
export class ForgotPasswordStep2Component implements OnInit {

  verificationCode: string;
  email: string;
  password: string;
  errorMessage: string;
  private sub: any;
  codeTextShowHide: boolean = false
  pwdTextShowHide: boolean = false

  constructor(private auth: AuthorizationService, public router: Router, public route: ActivatedRoute, private _commonService: CommonService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.email = params['email'];

    });
    this.errorMessage = null;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onNext() {
    this.errorMessage = null;
    this.auth.confirmNewPassword(this.email.toLowerCase(), this.verificationCode, this.password).subscribe((data) => {
      this.router.navigate(['/signin']);
    }, (err) => {
      this.errorMessage = err.message;
    });;;
  }

  codeShowHide() {
    this.codeTextShowHide = !this.codeTextShowHide
    const myElement: HTMLElement = document.getElementById("verificationCode");
    const myEyeElement: HTMLElement = document.getElementById("eyeOld");
    this._commonService.changeTextboxType(myElement, myEyeElement, this.codeTextShowHide)
  }

  pwdShowHide() {
    this.pwdTextShowHide = !this.pwdTextShowHide
    const myElement: HTMLElement = document.getElementById("newPassword");
    const myEyeElement: HTMLElement = document.getElementById("eyeNew");
    this._commonService.changeTextboxType(myElement, myEyeElement, this.pwdTextShowHide)
  }
}
