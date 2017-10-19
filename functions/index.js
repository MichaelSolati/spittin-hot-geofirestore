const functions = require('firebase-functions');
const admin = require('firebase-admin');
const GeoFire = require('geofire');
admin.initializeApp(functions.config().firebase);

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.restaurants = functions.database.ref('/restaurants/{restaurantId}').onCreate((event) => {
  const restaurants = admin.database().ref('/restaurants');
  const geoFire = new GeoFire(admin.database().ref('/geofire/restaurants'));
  restaurants.child(event.params.restaurantId).on('value', (snapshot) => {
    const restaurant = snapshot.val();
    let coordinates = restaurant.address.coords;
    if (coordinates.length !== 2) { return; }
    geoFire.set(event.params.restaurantId, coordinates.reverse()).then(() => {
      console.log('Restaurant geohash added');
    }).catch(error => {
      console.log(error);
    });
  });
});