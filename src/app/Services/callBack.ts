
export interface CognitoCallback {
    cognitoCallback(message: string, result: any): void;

    handleMFAStep?(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void;
    

}

export interface LoggedInCallback {
    isLoggedIn(message: string, loggedIn: boolean): void;
}
export interface ChallengeParameters {
    CODE_DELIVERY_DELIVERY_MEDIUM: string;

    CODE_DELIVERY_DESTINATION: string;
}



export class NewPasswordUser {
    username: string;
    existingPassword: string;
    password: string;
  }


  export class Stuff {
    public accessToken: string;
    public idToken: string;
}

export class geoLocation {
    public Lat: string;
    public Long: string;
}
