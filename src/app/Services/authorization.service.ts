var AWS = require('aws-sdk');

import { Injectable, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserAttribute, CognitoUserSession } from 'amazon-cognito-identity-js';
import { Observable } from 'rxjs';
import { ROUTER_CONFIGURATION } from '@angular/router';
// import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

import { ChallengeParameters, CognitoCallback, LoggedInCallback, NewPasswordUser } from "../Services/callBack";

import { environment } from "../../environments/environment";
//import { Client } from 'paho-mqtt';


const poolData = {
    UserPoolId: environment.userPoolId, // Your user pool id here
    ClientId: environment.clientId // Your client id here  
};

const userPool = new CognitoUserPool(poolData);

@Injectable()
export class AuthorizationService {
    cognitoUser: any;

    constructor() { }


    register(email, password, name, address, emailNotification, smsNotification, phoneNumber) {
        const attributeList = [];
        attributeList.push(new CognitoUserAttribute({
            Name: 'email',
            Value: email
        }));

        attributeList.push(new CognitoUserAttribute({
            Name: 'name',
            Value: name
        }));

        attributeList.push(new CognitoUserAttribute({
            Name: 'address',
            Value: address
        }));

        attributeList.push(new CognitoUserAttribute({
            Name: 'custom:Roles',
            Value: 'Test'
        }));

        attributeList.push(new CognitoUserAttribute({
            Name: 'custom:Rights',
            Value: 'Test'
        }));

        attributeList.push(new CognitoUserAttribute({
            Name: 'custom:Notification',
            Value: ''
        }));

        attributeList.push(new CognitoUserAttribute({
            Name: 'custom:EmailNotification',
            Value: emailNotification.toString()
        }));
        attributeList.push(new CognitoUserAttribute({
            Name: 'custom:SmsNotification',
            Value: smsNotification.toString()
        }));

        attributeList.push(new CognitoUserAttribute({
            Name: 'custom:PhoneNumber',
            Value: phoneNumber.toString()
        }));


        return Observable.create(observer => {
            userPool.signUp(email, password, attributeList, null, (err, result) => {
                if (err) {
                    // alert('e')
                    console.log("signUp error", err);
                    observer.error(err);
                }
                this.cognitoUser = result.user;
                console.log("signUp success", result);
                observer.next(result);
                observer.complete();
            });
        });
    }

    confirmAuthCode(code) {
        const user = {
            Username: this.cognitoUser.username,
            Pool: userPool
        };
        return Observable.create(observer => {
            const cognitoUser = new CognitoUser(user);
            cognitoUser.confirmRegistration(code, true, function (err, result) {
                if (err) {
                    console.log(err);
                    observer.error(err);
                }
                console.log("confirmAuthCode() success", result);
                observer.next(result);
                observer.complete();
            });
        });
    }

    signIn(email, password) {
        const authenticationData = {
            Username: email,
            Password: password,
        };
        const authenticationDetails = new AuthenticationDetails(authenticationData);
        const userData = {
            Username: email,
            Pool: userPool
        };
        const cognitoUser = new CognitoUser(userData);

        return Observable.create(observer => {

            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    observer.next(result);
                    observer.complete();
                },
                onFailure: function (err) {
                    console.log(err);
                    observer.error(err);
                },
            });
        });
    }

    isLoggedIn() {
        return userPool.getCurrentUser() != null;
    }

    getAuthenticatedUser() {
        return userPool.getCurrentUser();
    }

    logOut() {
        this.getAuthenticatedUser().signOut();
        this.cognitoUser = null;
    }

    forgotPassword(username: string) {
        let userData = {
            Username: username,
            Pool: userPool
        };

        let cognitoUser = new CognitoUser(userData);
        return Observable.create(observer => {
            cognitoUser.forgotPassword({
                onSuccess: function (result) {
                    observer.next(result);
                    observer.complete();
                },
                onFailure: function (err) {
                    observer.error(err);
                },
            });
        });
    }


    confirmNewPassword(email: string, verificationCode: string, password: string) {
        let userData = {
            Username: email,
            Pool: userPool
        };

        let cognitoUser = new CognitoUser(userData);
        return Observable.create(observer => {
            cognitoUser.confirmPassword(verificationCode, password, {
                onSuccess: function () {
                    observer.next();
                    observer.complete();
                },
                onFailure: function (err) {
                    observer.error(err);
                }
            });
        });
    }


    servers: any;

    Username() {
        const userData = {
            Username: userPool.getCurrentUser(),
            Pool: userPool
        };
        const cognitoUser = userPool.getCurrentUser();
        return Observable.create(observer => {
        });
    }

    authenticate(username: string, password: string, callback: CognitoCallback) {
        console.log("UserLoginService: starting the authentication");
        //alert(username)
        let authenticationData = {
            Username: username,
            Password: password,
        };
        let authenticationDetails = new AuthenticationDetails(authenticationData);

        let userData = {
            Username: username,
            Pool: userPool
        };

        console.log("UserLoginService: Params set...Authenticating the user");
        let cognitoUser = new CognitoUser(userData);
        //console.log("UserLoginService: config is " + AWS.config);
        cognitoUser.authenticateUser(authenticationDetails, {
            newPasswordRequired: (userAttributes, requiredAttributes) => callback.cognitoCallback(`User needs to set password.`, null),
            onSuccess: result => this.onLoginSuccess(callback, result),
            onFailure: function (err) {
                callback.cognitoCallback(err.message, username)
            },
            mfaRequired: (challengeName, challengeParameters) => {
                callback.handleMFAStep(challengeName, challengeParameters, (confirmationCode: string) => {
                    cognitoUser.sendMFACode(confirmationCode, {
                        onSuccess: result => this.onLoginSuccess(callback, result),
                        onFailure: function (err) {
                            //alert(err.message)
                            //observer.error(err); 
                        }
                    });
                });
            }
        });
    }


    private onLoginSuccess = (callback: CognitoCallback, session: CognitoUserSession) => {

        console.log("In authenticateUser onSuccess callback");

        ///AWS.config.credentials = this.buildCognitoCreds(session.getIdToken().getJwtToken());

        // So, when CognitoIdentity authenticates a user, it doesn't actually hand us the IdentityID,
        // used by many of our other handlers. This is handled by some sly underhanded calls to AWS Cognito
        // API's by the SDK itself, automatically when the first AWS SDK request is made that requires our
        // security credentials. The identity is then injected directly into the credentials object.
        // If the first SDK call we make wants to use our IdentityID, we have a
        // chicken and egg problem on our hands. We resolve this problem by "priming" the AWS SDK by calling a
        // very innocuous API call that forces this behavior.
        let clientParams: any = {};
        if (environment.sts_endpoint) {
            clientParams.endpoint = environment.sts_endpoint;
        }
        //let sts = new STS(clientParams);
        //sts.getCallerIdentity(function (err, data) {
        console.log("UserLoginService: Successfully set the AWS credentials");
        callback.cognitoCallback(null, session);
        //});
    }

    newPassword(newPasswordUser: NewPasswordUser, callback: CognitoCallback): void {

        //alert(newPasswordUser)
        console.log(newPasswordUser);
        // Get these details and call
        //cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this);
        let authenticationData = {
            Username: newPasswordUser.username,
            Password: newPasswordUser.existingPassword,
        };
        let authenticationDetails = new AuthenticationDetails(authenticationData);

        let userData = {
            Username: newPasswordUser.username,
            Pool: userPool
        };

        console.log("UserLoginService: Params set...Authenticating the user");
        let cognitoUser = new CognitoUser(userData);
        //console.log("UserLoginService: config is " + AWS.config);
        cognitoUser.authenticateUser(authenticationDetails, {
            newPasswordRequired: function (userAttributes, requiredAttributes) {
                // User was signed up by an admin and must provide new
                // password and required attributes, if any, to complete
                // authentication.

                // the api doesn't accept this field back
                delete userAttributes.email_verified;
                cognitoUser.completeNewPasswordChallenge(newPasswordUser.password, requiredAttributes, {
                    onSuccess: function (result) {
                        callback.cognitoCallback(null, userAttributes);
                    },
                    onFailure: function (err) {
                        callback.cognitoCallback(err.message, null);
                    }
                });
            },
            onSuccess: function (result) {
                callback.cognitoCallback(null, newPasswordUser);
            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            }
        });
    }


    confirmRegistration(username: string, confirmationCode: string, callback: CognitoCallback): void {
        //alert(username)
        let userData = {
            Username: username,
            Pool: userPool
        };
        let cognitoUser = new CognitoUser(userData);
        cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                callback.cognitoCallback(null, result);
            }
        });
    }


    resendCode(username: string, callback: CognitoCallback): void {
        let userData = {
            Username: username,
            Pool: userPool
        };

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.resendConfirmationCode(function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                callback.cognitoCallback(null, result);
            }
        });
    }

    chnagePAssword(oldPassword, newPassword, callback: CognitoCallback): void {

        const poolData = {
            UserPoolId: environment.userPoolId, // Your user pool id here
            ClientId: environment.clientId // Your client id here  
        };

        const userPool = new CognitoUserPool(poolData);
        let cognitoUser = userPool.getCurrentUser();
        if (cognitoUser != null) {
            cognitoUser.getSession(function (err, session) {
                //alert('1')
                if (err)
                    console.log("UserParametersService: Couldn't retrieve the user");
                else {
                    cognitoUser.changePassword(oldPassword, newPassword, function (err, result) {
                        //  alert('2')
                        if (err) {
                            console.log("UserParametersService: in getParameters: " + err);
                            callback.cognitoCallback(err.message, result);
                        } else {
                            callback.cognitoCallback(null, result);
                        }
                    });
                }

            });
        } else {
            callback.cognitoCallback(null, null);
        }


    }

    UpdateloggedinUser() {
        const attributeList = [];

        attributeList.push(new CognitoUserAttribute({
            Name: 'nickname',
            Value: 'name1'
        }));
        attributeList.push(new CognitoUserAttribute({
            Name: 'name',
            Value: 'name1'
        }));

        attributeList.push(new CognitoUserAttribute({
            Name: 'address',
            Value: 'address1'
        }));

        attributeList.push(new CognitoUserAttribute({
            Name: 'given_name',
            Value: 'sam1'
        }));

        attributeList.push(new CognitoUserAttribute({
            Name: 'email',
            Value: 'kandy_deol2000@yahoo.com'
        }));

        /////////////Test
        // let userData = {
        //   Username: 'kandydeol2gmail.com',
        //   Pool: userPool
        // };

        // let cognitoUser = new CognitoUser(userData);
        ////////


        const poolData = {
            UserPoolId: environment.userPoolId, // Your user pool id here
            ClientId: environment.clientId // Your client id here  
        };

        const userPool = new CognitoUserPool(poolData);
        let cognitoUser = userPool.getCurrentUser();
        if (cognitoUser != null) {
            cognitoUser.getSession(function (err, session) {
                //alert('1')
                if (err)
                    console.log("UserParametersService: Couldn't retrieve the user");
                else {
                    cognitoUser.updateAttributes(attributeList, function (err, result) {
                        //  alert('2')
                        if (err) {
                            console.log("UserParametersService: in getParameters: " + err);
                            //       alert(err.message)
                            //callback.cognitoCallback(err.message,result);
                        } else {
                            //       alert(result)  
                            //callback.cognitoCallback(null,result);
                        }
                    });
                }

            });
        } else {
            //alert('3')
            //callback.cognitoCallback(null,null);
        }
    }

    isAuthenticated(callback: LoggedInCallback) {
        if (callback == null)
            throw ("UserLoginService: Callback in isAuthenticated() cannot be null");

        let cognitoUser = userPool.getCurrentUser();

        if (cognitoUser != null) {
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    console.log("UserLoginService: Couldn't get the session: " + err, err.stack);
                    callback.isLoggedIn(err, false);
                }
                else {
                    console.log("UserLoginService: Session is " + session.isValid());
                    callback.isLoggedIn(err, session.isValid());
                }
            });
        } else {
            console.log("UserLoginService: can't retrieve the current user");
            callback.isLoggedIn("Can't retrieve the CurrentUser", false);
        }
    }

    getAccessToken(callback: Callback): void {
        if (callback == null) {
            throw ("CognitoUtil: callback in getAccessToken is null...returning");
        }
        if (userPool.getCurrentUser() != null) {
            userPool.getCurrentUser().getSession(function (err, session) {
                if (err) {
                    console.log("CognitoUtil: Can't set the credentials:" + err);
                    callback.callbackWithParam(null);
                }
                else {
                    if (session.isValid()) {
                        callback.callbackWithParam(session.getAccessToken().getJwtToken());
                    }
                }
            });
        }
        else {
            callback.callbackWithParam(null);
        }
    }

    getIdToken(callback: Callback): void {
        if (callback == null) {
            throw ("CognitoUtil: callback in getIdToken is null...returning");
        }
        if (userPool.getCurrentUser() != null)
            userPool.getCurrentUser().getSession(function (err, session) {
                if (err) {
                    console.log("CognitoUtil: Can't set the credentials:" + err);
                    callback.callbackWithParam(null);
                }
                else {
                    if (session.isValid()) {
                        callback.callbackWithParam(session.getIdToken().getJwtToken());
                    } else {
                        console.log("CognitoUtil: Got the id token, but the session isn't valid");
                    }
                }
            });
        else
            callback.callbackWithParam(null);
    }

    deleteUser(username: string, callback: CognitoCallback): void {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
            apiVersion: '2016-04-18'
        });
        var params = {
            UserPoolId: environment.userPoolId, /* required */
            Username: username /* required */
        };
        cognitoidentityserviceprovider.adminDeleteUser(params, function (err, data) {
            if (err) {
                //alert(err+'======='+ err.stack); // an error occurred
                callback.cognitoCallback(err.message, null);
            }
            else {
                callback.cognitoCallback(null, data);
                // alert(data);           // successful response
            }
        });
    }

    updateUserData(email, name, address, emailNotification, smsNotification, phoneNumber) {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
            apiVersion: '2016-04-18'
        });

        var params = {
            UserAttributes: [ /* required */
                {
                    Name: 'email',
                    Value: email
                },
                {
                    Name: 'name',
                    Value: name
                },
                {
                    Name: 'address',
                    Value: address
                },
                {
                    Name: 'custom:Roles',
                    Value: "Test"
                },
                {
                    Name: 'custom:Notification',
                    Value: ''
                },
                {
                    Name: 'custom:EmailNotification',
                    Value: emailNotification.toString()
                },
                {
                    Name: 'custom:SmsNotification',
                    Value: smsNotification.toString()
                },
                {
                    Name: 'custom:PhoneNumber',
                    Value: phoneNumber.toString()
                },


            ],
            UserPoolId: environment.userPoolId, /* required */
            Username: email /* required */
        };
        return Observable.create(observer => {
            cognitoidentityserviceprovider.adminUpdateUserAttributes(params, function (err, data) {
                if (err) {
                    alert('e')
                    console.log("signUp error", err);
                    observer.error(err);
                }
                else {
                    console.log(data);
                    console.log("signUp success", data);
                    observer.next(data);
                    observer.complete();
                }          // successful response
            });
        });
    }
}

export interface Callback {
    callback(): void;

    callbackWithParam(result: any): void;
}

