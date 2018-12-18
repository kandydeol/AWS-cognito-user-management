import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/Services/authorization.service';
import { environment } from "../../environments/environment";


import { Router } from '@angular/router';
var AWS = require('aws-sdk');


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  data: any[]
  dataArray: Array<any> = []
  filter:string
  columnCount: number = 9;
  tblWidth: string = (100 / this.columnCount) + '%';

  key: string = 'Name'; //set default
  reverse: boolean = false;
  sort(key) {

    this.key = key;
    this.reverse = !this.reverse;
    // alert(this.key)
  }
  //Sort
  p: number = 1;
  deleteUserId: string
  msgs: string;
  constructor(private auth: AuthorizationService,   private _router: Router) { }

  ngOnInit() {
    

    this.bindData()

  }



  bindData() {
    let idTokenJwt = localStorage.getItem('JWTToken')
    console.log(AWS.config.credentials);
    let userPolIDTemp = 'cognito-idp.' + environment.region + '.amazonaws.com/' + environment.userPoolId;
    AWS.config.region = environment.region; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: environment.identityPoolId, // your identity pool id here
      Logins: {
        // Change the key below according to the specific region your user pool is in.
        userPolIDTemp: idTokenJwt
      }
    });
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: environment.identityPoolId,
    });
    const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
      apiVersion: '2016-04-18'
    });
    const parameters = {
      UserPoolId: environment.userPoolId, // Your user pool id here
      AttributesToGet: ['email', 'name', 'custom:Roles', 'custom:PhoneNumber', 'custom:EmailNotification', 'custom:SmsNotification', 'address']
    };
    return cognitoidentityserviceprovider.listUsers(parameters, (err, data) => {
      // console.log(err)
      // console.log(this.data)
      // alert(err)
      // alert(this.data)
      this.data = data.Users
      console.log(this.data)
      this.prepareData(this.data)
    })
  }

  prepareData(Data) {
    this.dataArray = []
    for (var key in Data) {
      this.dataArray.push({
        "Username": Data[key]['Username']
        , "UserCreateDate": Data[key]['UserCreateDate']
        , "UserLastModifiedDate": Data[key]['UserLastModifiedDate']
        , "Enabled": Data[key]['Enabled']
        , "UserStatus": Data[key]['UserStatus']
        , "Name": this.prepareDataAttributes(Data[key]['Attributes'], 'Name')
        , "Mail": this.prepareDataAttributes(Data[key]['Attributes'], 'Mail')
        , "PhoneNumber": this.prepareDataAttributes(Data[key]['Attributes'], 'PhoneNumber')
        , "Roles": this.prepareDataAttributes(Data[key]['Attributes'], 'Roles')
        , "EmailNotification": this.prepareDataAttributes(Data[key]['Attributes'], 'EmailNotification')
        , "SmsNotification": this.prepareDataAttributes(Data[key]['Attributes'], 'SmsNotification')
        , "Address": this.prepareDataAttributes(Data[key]['Attributes'], 'Address')

      })

      
    }
    console.log(this.dataArray)
  }

  prepareDataAttributes(attributesData, filter) {
    for (var key in attributesData) {
      if (attributesData[key].Name == 'name' && filter == 'Name')
        return attributesData[key].Value;
      if (attributesData[key].Name == 'email' && filter == 'Mail')
        return attributesData[key].Value;
      if (attributesData[key].Name == 'custom:PhoneNumber' && filter == 'PhoneNumber')
        return attributesData[key].Value;
      if (attributesData[key].Name == 'custom:Roles' && filter == 'Roles')
        return attributesData[key].Value;
      if (attributesData[key].Name == 'custom:EmailNotification' && filter == 'EmailNotification')
        return attributesData[key].Value;
      if (attributesData[key].Name == 'custom:SmsNotification' && filter == 'SmsNotification')
        return attributesData[key].Value;
        if (attributesData[key].Name == 'address' && filter == 'Address')
        return attributesData[key].Value;
    }
  }

  cognitoCallback(error: any, result: any) {

    if (error != null) {
      alert(error)
    } else {
      this.msgs = 'Record deleted successfully.'

    }
  }

  confirm(val) {
    //this.deleteUserId=val
  
        
        this.auth.deleteUser(val, this)
  
  }
  editUser(val){
    //alert(val)
    localStorage.setItem('EditItem',val)
    this._router.navigate(['/registeruser']);
   
  }
  refresh(): void {
    window.location.reload();
  }

  addNewUser(){
    localStorage.removeItem('EditItem')
    this._router.navigate(['/registeruser']);
}

}
