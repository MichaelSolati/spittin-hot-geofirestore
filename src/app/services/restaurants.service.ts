import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { GeoFirestore, GeoFirestoreQuery } from 'geofirestore';
import { Geokit, LatLngLiteral } from 'geokit';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { LocationService } from './location.service';

@Injectable()
export class RestaurantsService {
  private _geoFirestore: GeoFirestore = new GeoFirestore(firebase.firestore().collection('restaurants'));
  private _previousCoords: firebase.firestore.GeoPoint = new firebase.firestore.GeoPoint(0, 0);
  private _restaurants: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private _query: GeoFirestoreQuery;

  constructor(private _ls: LocationService) {
    this._createQuery();

    this._ls.mapCenter.subscribe((center: firebase.firestore.GeoPoint) => {
      if (Geokit.distance(this._geopoint2Literal(center), this._geopoint2Literal(this._previousCoords)) > 0.5) {
        this._previousCoords = center;
        console.log('Updating GeoFirestore Query Center');
        this._query.updateCriteria({ center });
      }
    });
  }

  get restaurants(): Observable<any[]> {
    return this._restaurants.asObservable();
  }

  private _createQuery(): void {
    this._query = this._geoFirestore.query({
      center: new firebase.firestore.GeoPoint(0, 0),
      radius: .5
    });

    this._query.on('ready', () => console.log('GeoFirestore Query Complete'));

    this._query.on('key_exited', ($key: string) => {
      const places: any[] = [...this._restaurants.value];
      this._restaurants.next(places.filter((place) => place.$key !== $key));
    });

    this._query.on('key_entered', ($key: string, result: any) => {
      const places: any[] = [...this._restaurants.value];
      result.$key = $key;
      places.push(result);
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
