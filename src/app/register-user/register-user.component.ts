import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/Services/authorization.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';


@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {
  confirmCode: boolean = false;
  codeWasConfirmed: boolean = false;
  error: string = "";

  errorMessage: string;
  sucessMessage: string

  pwdTextShowHide: boolean = false
  filter: boolean = false
  showPassword: boolean = true

  fullName: string
  mailID: string
  userAddress: string
  userPassword: string
  userEmailNotification: boolean
  userSmsNotification: boolean
  userPhoneNumber: string
  UserRole: string
  submitButtontext = 'Register New User'

  constructor(private auth: AuthorizationService,
    private _router: Router, private _commonService: CommonService) {

  }

  ngOnInit() {
    this.bindDataOnLoad();
  }

  register(form: NgForm) {

    //alert(this.RoleID )
    const email = form.value.email.toLowerCase();
    const password = form.value.password;
    const name = form.value.name;
    const phone = "2234"// form.value.phone;
    let address = form.value.address;
    let emailNotification = form.value.emailNotification;
    let smsNotification = form.value.smsNotification;
    let phoneNumber = form.value.phoneNumber;

    if (phoneNumber == undefined || phoneNumber == '') {
      phoneNumber = '0000'
    }
    if (smsNotification == undefined)
      smsNotification = false

    if (emailNotification == undefined)
      emailNotification = false
    if (address == undefined)
      address = 'address'

    //alert(phoneNumber)


    let val = localStorage.getItem('EditItem')
    if (val == null) {
      this.auth.register(email, password, name, address, emailNotification, smsNotification, phoneNumber).subscribe(
        (data) => {
          this.confirmCode = true;
          this.sucessMessage = 'User created successfully.'
        },
        (err) => {
          console.log(err);
          alert(err.message)

          this.errorMessage = err.message;
        }
      );
    }
    else {
      this.auth.updateUserData(email, name, address, emailNotification, smsNotification, phoneNumber).subscribe(
        (data) => {
          this.confirmCode = true;
          this.sucessMessage = 'User updated successfully.'
        },
        (err) => {
          console.log(err);
          alert(err.message)

          this.errorMessage = err.message;
        }
      );
    }
  }

  validateAuthCode(form: NgForm) {
    const code = form.value.code;
    this.auth.confirmAuthCode(code).subscribe(
      (data) => {
        this.codeWasConfirmed = true;
        this.confirmCode = false;
      },
      (err) => {
        console.log(err);
        this.error = "Confirm Authorization Error has occurred";
      });
  }



  pwdShowHide() {
    this.pwdTextShowHide = !this.pwdTextShowHide
    //alert(this.textShowHide)
    const myElement: HTMLElement = document.getElementById("password");
    const myEyeElement: HTMLElement = document.getElementById("eye");
    this._commonService.changeTextboxType(myElement, myEyeElement, this.pwdTextShowHide)
  }

  refresh(): void {
    window.location.reload();
  }


  checkboxClicked(val) {
    this.filter = !this.filter;
  }

  bindDataOnLoad() {
    let val = localStorage.getItem('EditItem')

    if (val == null)
      return
    //alert(val)
    this.submitButtontext = 'Update User'
    let x = val.split("^");
    let Name = x[0];
    let Mail = x[1];
    //let Roles = x[2];
    let UserStatus = x[3];
    let UserCreateDate = x[4];
    let EmailNotification = x[5];
    let SmsNotification = x[6];
    let PhoneNumber = x[7];
    let Address = x[8];
    console.log(x)
    this.fullName = Name
    this.mailID = Mail

    //this.UserRole = Roles
    this.userEmailNotification = JSON.parse(EmailNotification);
    this.userSmsNotification = JSON.parse(SmsNotification);
    this.userPhoneNumber = PhoneNumber
    this.userAddress = Address

    if (this.userSmsNotification == true)
      this.filter = true



    this.showPassword = false


    //alert(Name)

  }
}
