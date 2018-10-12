// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDFnedGL4qr_jenIpWYpbvot8s7Vuay_88',
    authDomain: 'geofirestore.firebaseapp.com',
    databaseURL: 'https://geofirestore.firebaseio.com',
    projectId: 'geofirestore',
    storageBucket: 'geofirestore.appspot.com',
    messagingSenderId: '830598661992'
  }
};
