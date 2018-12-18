import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/Services/authorization.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { LoginComponent } from '../login/login.component';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-confirm-code',
  templateUrl: './confirm-code.component.html',
  styleUrls: ['./confirm-code.component.css'],
  providers: [LoginComponent]
})
export class ConfirmCodeComponent implements OnInit {

  confirmationCode: string;
  email: string;
  errorMessage: string;
  private sub: any;
  textShowHide: boolean = false

  constructor(public auth: AuthorizationService, public _router: Router, public route: ActivatedRoute,
    private _LoginComponent: LoginComponent, private _commonService: CommonService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.email = params['username'];
    });
    this.errorMessage = null;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  register(form: NgForm) {
    const code = form.value.Code;
    this.errorMessage = null;
    this.auth.confirmRegistration(this.email, code, this);
  }

  cognitoCallback(message: string, result: any) {
    if (message != null) { //error
      this.errorMessage = message;
      console.log("message: " + this.errorMessage);

    } else { //success
      //move to the next step
      console.log("Moving to securehome");
      console.log(result)
      let Username = localStorage.getItem("email")
      let Password = localStorage.getItem("Item")
      localStorage.setItem('LoginMode', 'Confirm')
      this._LoginComponent.loginFromSettingNewPassword(Username, Password)
    }
  }
  cognitoLoginCallback(message: string, result: any) { }
  
  codeShowHide() {
    this.textShowHide = !this.textShowHide
    const myElement: HTMLElement = document.getElementById("Code");
    const myEyeElement: HTMLElement = document.getElementById("eye");
    this._commonService.changeTextboxType(myElement, myEyeElement, this.textShowHide)
  }
}
