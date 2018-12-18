import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import { Router } from '@angular/router';
import {AuthorizationService} from '../Services/authorization.service'

import { NewPasswordUser } from '../Services/callBack';
import{LoginComponent} from '../login/login.component'
@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.css'],
  providers:[LoginComponent]
})
export class SetNewPasswordComponent implements OnInit {

   //router: Router;
  errorMessage: string;
  registrationUser: NewPasswordUser;
  
  constructor(private auth: AuthorizationService,
    private _router: Router,private _LoginComponent:LoginComponent) {
    this.registrationUser = new NewPasswordUser();
        this.errorMessage = null;
   }

  ngOnInit() {

  }

  onRegister() {
    
    console.log(this.registrationUser);
    this.errorMessage = null;
    this.auth.newPassword(this.registrationUser, this);
}
cognitoCallback(message: string, result: any) {
  
  //alert(message)
  if (message != null) { //error
      this.errorMessage = message;
      console.log("result: " + this.errorMessage);
  } else { //success
   // alert('s')
      //move to the next step
      //console.log("redirecting");
      localStorage.setItem("loginFlag","1")
      //this._router.navigate(['/Home']);
      this._LoginComponent.loginFromSettingNewPassword(this.registrationUser.username,this.registrationUser.password)
      
  }
  
}



}
