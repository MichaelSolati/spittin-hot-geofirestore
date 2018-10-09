import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { GeoFirestore, GeoFirestoreQuery } from 'geofirestore';
import { Geokit, LatLngLiteral } from 'geokit';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { LocationService } from './location.service';

function quicksort(c: any[]): any {
  if (c.length <= 1) { return c; }
  const pivot: any = c.pop();
  const less: any[] = [];
  const more: any[] = [];
  c.forEach((val: any) => (pivot.distance > val.distance) ? less.push(val) : more.push(val));
  return [...quicksort(less), pivot, ...quicksort(more)];
}

@Injectable()
export class RestaurantsService {
  private _geoFirestore: GeoFirestore;
  private _previousCoords: firebase.firestore.GeoPoint = new firebase.firestore.GeoPoint(0, 0);
  private _restaurants: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private _query: GeoFirestoreQuery;

  constructor(private _ls: LocationService) {
    this._geoFirestore = new GeoFirestore(firebase.firestore().collection('restaurants'));
    this._ls.mapCenter.subscribe((coords: firebase.firestore.GeoPoint) => {
      if (Geokit.distance(this._geopoint2Literal(coords), this._geopoint2Literal(this._previousCoords)) > 0.5) {
        this._previousCoords = coords;
        this._geoFetch(coords);
      }
    });
  }

  get restaurants(): Observable<any[]> {
    return this._restaurants.asObservable();
  }

  private _geoFetch(center: firebase.firestore.GeoPoint): void {
    const max = 100;
    if (this._query) {
      this._query.cancel();
      this._query = null;
    }
    this._query = this._geoFirestore.query({
      center,
      radius: 1
    });

    this._query.on('key_entered', ($key: string, result: any) => {
      let places: any[] = [...this._restaurants.value];
      result.$key = $key;
      if (places.find((place: any) => place.id === result.$key)) { return; }
      places.push(result);
      places.map((place: any) => place.distance = Geokit.distance(
        this._geopoint2Literal(center),
        this._geopoint2Literal(place.coordinates),
        'miles')
      );
      places = quicksort(places);
      if (places.length > max) { places = places.slice(0, max); }
      this._restaurants.next(places);
    });
  }

  private _geopoint2Literal(coordinates: firebase.firestore.GeoPoint): LatLngLiteral {
    return {
      lat: coordinates.latitude,
      lng: coordinates.longitude
    };
  }
}
