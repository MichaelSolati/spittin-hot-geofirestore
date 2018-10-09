import * as admin from 'firebase-admin';
import { Geokit } from 'geokit';

export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export function filter(unprocessed: any[]): any[] {
  return unprocessed.reduce((processed: any[], restaurant: any) => {
    if (validateCoordinates(restaurant.coordinates)) {
      processed.push(restaurant);
    }
    return processed;
  }, []);
}

export function parse(unprocessed: any[]): any[] {
  return unprocessed.map((restaurant: any) => {
    restaurant.coordinates = new admin.firestore.GeoPoint(restaurant.coordinates[0], restaurant.coordinates[1]);
    return {
      g: Geokit.hash({ lat: restaurant.coordinates.latitude, lng: restaurant.coordinates.longitude }),
      l: restaurant.coordinates,
      d: restaurant
    };
  });
}

function validateCoordinates(coords: number[]): boolean {
  if (coords.length !== 2) {
    return false;
  } else if (coords[0] > 90 || coords[0] < -90) {
    return false;
  } else if (coords[1] > 180 || coords[1] < -180) {
    return false;
  }

  return true;
}
