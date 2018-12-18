import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class CommonService {
  treePreviousNode:HTMLElement
  
  constructor(private router : Router){}


  //Check login Status
  checkLogin(){
    if (localStorage.getItem('JWTToken') != null)
    {
      return true;
      //this.router.navigate(['/Home']);
    }
    else{
      return false;
      //this.router.navigate(['/signin']);
    }
  }

  
  roleMatch(allowedRoles): boolean {
    var isMatch = false;
    var userRoles: string[] = JSON.parse(localStorage.getItem('Roles'));
    allowedRoles.forEach(element => {
      if (userRoles.indexOf(element) > -1) {
        isMatch = true;
        return false;
      }
    });
    return isMatch;

  }

  roleRightsMatch(allowedRoles): boolean {
    var isMatch = false;
    var userRoles: string[] = JSON.parse(localStorage.getItem('Rights'));
    allowedRoles.forEach(element => {
      if (userRoles.indexOf(element) > -1) {
        isMatch = true;
        return false;
      }
    });
    
    return isMatch;

  }

  changeTextboxType(myElement,myEyeElement,event){
    
    if(event==true){
        myElement.type='text';
        myEyeElement.setAttribute("class","glyphicon glyphicon-eye-open")
    }
    else{
      myElement.type='password';
      myEyeElement.setAttribute("class","glyphicon glyphicon-eye-close")
    }
  }

}