import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthorizationService } from '../Services/authorization.service'

import { geoLocation } from '../Services/callBack'
import { CommonService } from '../Services/common.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  errorMessage: string;
  mfaStep = false;
  textShowHide: boolean = false

  mfaData = {
    destination: '',
    callback: null
  };
  constructor(private auth: AuthorizationService,
    private _router: Router, private _commonService: CommonService) {
  }

  setPosition: any
  ngOnInit() {
    this._commonService.checkLogin()
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(this.showPosition);
    };
  }

  showPosition(position) {
    localStorage.setItem("Lat", position.coords.latitude)
    localStorage.setItem("Long", position.coords.latitude)
  }

  onSubmit(form: NgForm) {
    const email = form.value.email.toLowerCase();
    const password = form.value.Password;
    localStorage.setItem("email", email)
    localStorage.setItem("Item", password)
    this.auth.authenticate(email, password, this);
  }

  loginFromSettingNewPassword(Username, Password) {
    this.auth.authenticate(Username, Password, this);
  }
  
  cognitoCallback(message: string, result: any) {
    if (message != null) { //error
      this.errorMessage = message;
      console.log("result: " + this.errorMessage);
      if (this.errorMessage === 'User is not confirmed.') {
        console.log("redirecting");
        this._router.navigate(['/confirmcode', result]);
      } else if (this.errorMessage === 'User needs to set password.') {
        //alert('a')
        console.log("redirecting to set new password");
        this._router.navigate(['/newpassword']);
      }

    } else { //success
      var array = [result.idToken.payload['custom:Roles']];
      var json = JSON.stringify(array);
      localStorage.setItem("Username", result.idToken.payload.name)
      localStorage.setItem("JWTToken", result.accessToken.jwtToken)
      // localStorage.setItem("Roles",json)
      // localStorage.setItem("Rights",result.idToken.payload['custom:Rights'])
      if (localStorage.getItem('LoginMode') != null) {
        this._router.navigate(['/changepassword']);
      }
      else {
        this._router.navigate(['home']);
        this.refresh()
        window.location.reload();
      }
    }
  }

  cognitoLoginCallback(message: string, result: any) { }

  pwdShowHide() {
    this.textShowHide = !this.textShowHide
    const myElement: HTMLElement = document.getElementById("password");
    const myEyeElement: HTMLElement = document.getElementById("eye");
    this._commonService.changeTextboxType(myElement, myEyeElement, this.textShowHide)
  }

  refresh(): void {
    window.location.reload();
  }

}
