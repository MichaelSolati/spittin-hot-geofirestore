const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://spittin-hot-geofire.firebaseio.com'
});

admin.database().ref().remove().then(() => {
  const restaurants = admin.database().ref('/restaurants');
  const contents = fs.readFileSync('restaurants.json');
  const jsonContent = JSON.parse(contents);

  const processedRestaurants = [];

  for (const restaurant of jsonContent) {
    processedRestaurants.push(restaurants.push(restaurant));
  }

  Promise.all(processedRestaurants).then(() => {
    process.exit(0);
  });
});