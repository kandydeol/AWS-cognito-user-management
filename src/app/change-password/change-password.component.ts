import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/Services/authorization.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  errorMessage: string;
  private sub: any;
  sucessMessage: boolean = false
  oldTextShowHide: boolean = false
  newTextShowHide: boolean = false


  constructor(public auth: AuthorizationService, public router: Router, public route: ActivatedRoute, private _commonService: CommonService) {
  }
  ngOnInit() {
  }

  onChangePassword(form: NgForm) {
    const oldPassword = form.value.oldPassword;
    const newPassword = form.value.newPassword;
    this.auth.chnagePAssword(oldPassword, newPassword, this);

  }

  cognitoCallback(message: string, result: any) {
    if (message != null) { //error
      this.errorMessage = message;
      console.log("result: " + this.errorMessage);
    }
    else {
      //success
      //move to the next step
      console.log("redirecting");
      this.sucessMessage = true

    }
  }

  cognitoLoginCallback(message: string, result: any) { }

  OldPwdShowHide() {
    this.oldTextShowHide = !this.oldTextShowHide
    const myElement: HTMLElement = document.getElementById("oldPassword");
    const myEyeElement: HTMLElement = document.getElementById("eyeOld");
    this._commonService.changeTextboxType(myElement, myEyeElement, this.oldTextShowHide)
  }

  NewPwdShowHide() {
    this.newTextShowHide = !this.newTextShowHide
    const myElement: HTMLElement = document.getElementById("newPassword");
    const myEyeElement: HTMLElement = document.getElementById("eyeNew");
    this._commonService.changeTextboxType(myElement, myEyeElement, this.newTextShowHide)
  }

  refresh(): void {
    window.location.reload();
  }

}
