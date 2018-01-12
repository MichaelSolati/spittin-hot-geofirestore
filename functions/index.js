const functions = require('firebase-functions');
const admin = require('firebase-admin');
const GeoFire = require('geofire');
admin.initializeApp(functions.config().firebase);

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.restaurants = functions.database.ref('/restaurants/{restaurantId}').onCreate((event) => {
  const geoFire = new GeoFire(admin.database().ref('/geofire/restaurants'));
  const restaurant = event.data.val();
  if (Array.isArray(restaurant.coordinates) && restaurant.coordinates.length === 2) {
    return geoFire.set(event.params.restaurantId, restaurant.coordinates);
  }
  return event;
});