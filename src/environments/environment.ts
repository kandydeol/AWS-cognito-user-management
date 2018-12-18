// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  //******congnito stting parameters Start ********/
  region: 'XXXXXXXXXXXXXXXXXXXXXXXXX',

  identityPoolId: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  userPoolId: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  clientId: 'XXXXXXXXXXXXXXXXXXXXXXXXX',

  rekognitionBucket: 'rekognition-pics',
  albumName: "usercontent",
  bucketRegion: 'XXXXXXXXXXXXXXXXXXXXXXXXX',

  ddbTableName: 'LoginTrail',

  cognito_idp_endpoint: '',
  cognito_identity_endpoint: '',
  sts_endpoint: '',
  dynamodb_endpoint: '',
  s3_endpoint: '',
  //******congnito stting parameters End ********/
};


/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
