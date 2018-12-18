import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/Services/authorization.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-resend-code',
  templateUrl: './resend-code.component.html',
  styleUrls: ['./resend-code.component.css']
})
export class ResendCodeComponent implements OnInit {
  email: string;
  errorMessage: string;
  constructor(private auth: AuthorizationService,public router: Router) { }

  ngOnInit() {
  }
  resendCode() {
    //alert(this.email)
    this.auth.resendCode(this.email, this);
}
resendForm(form: NgForm) {
  const mailID = form.value.email.toLowerCase();
  //alert(mailID)
  this.auth.resendCode(mailID, this);
 // alert('a')
}
cognitoCallback(error: any, result: any) {
  //alert('a')
  if (error != null) {
      this.errorMessage = "Something went wrong...please try again";
  } else {
    
      this.router.navigate(['/confirmcode',this.email]);
  }
}
cognitoLoginCallback(message: string, result: any)
{}
}
