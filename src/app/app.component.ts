import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = 'Cognito';
  isLoggedIn:boolean=false
  constructor(   private _router: Router, private _commonService: CommonService){
   
  }

  ngOnInit(){
    this.isLoggedIn= this._commonService.checkLogin()
}

logOut(){
  localStorage.removeItem("Username")  
    localStorage.removeItem("JWTToken")  
    localStorage.removeItem("tempSelection")
    localStorage.removeItem('EditItem')
    this._router.navigate(['/signin']);
    this.refresh()
}

refresh(): void {
  window.location.reload();
}
}
