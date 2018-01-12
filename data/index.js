const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://' + serviceAccount['project_id'] + '.firebaseio.com'
});

const restaurantsRef = admin.database().ref('/restaurants');

// https://data.cityofchicago.org/Health-Human-Services/Restaurant/5udb-dr6f/data
const chicago = JSON.parse(fs.readFileSync('cities/chicago.json'));
// https://docs.mongodb.com/getting-started/shell/import-data/
const newYork = JSON.parse(fs.readFileSync('cities/new-york.json'));

admin.database().ref().remove().then(() => {
  const restaurants = [
    ...process(newYork),
    ...process(chicago)
  ];

  Promise.all(restaurants).then(() => {
    console.log('Finished Inserting ' + restaurants.length + ' Restaurants');
    process.exit(0);
  }).catch((err) => {
    console.log('Finished Inserting ' + restaurants.length + ' Restaurants');
    process.exit(0);
  });
});

const process = (restaurants) => {
  const processed = [];
  restaurants.forEach((restaurant) => {
    processed.push(restaurantsRef.push(restaurant).catch(e => e));
  });
  return processed;
}
