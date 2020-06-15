import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { GeoFirestore, GeoCollectionReference } from 'geofirestore';
import { Geokit, LatLngLiteral } from 'geokit';
import { BehaviorSubject, Observable } from 'rxjs';

import { LocationService } from './location.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {
  private _collection: GeoCollectionReference = new GeoFirestore(firebase.firestore()).collection('restaurants');
  private _previousCoords: firebase.firestore.GeoPoint = new firebase.firestore.GeoPoint(0, 0);
  private _restaurants: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private _ls: LocationService) {
    this._ls.mapCenter.subscribe((center: firebase.firestore.GeoPoint) => {
      if (Geokit.distance(this._geopoint2Literal(center), this._geopoint2Literal(this._previousCoords)) > 0.5) {
        this._previousCoords = center;
        console.log('Updating Center Of Query');
        this._query(center);
      }
    });
  }

  get restaurants(): Observable<any[]> {
    return this._restaurants.asObservable();
  }

  private _query(center = this._previousCoords): void {
    const query = this._collection.near({ center, radius: .5 });

    query.get().then((snapshot) => {
      console.log('New Snapshot');
      const docs = snapshot.docs.map((doc) => {
        return { $key: doc.id, ...doc.data() };
      });
      this._restaurants.next(docs);
    });
  }

  private _geopoint2Literal(coordinates: firebase.firestore.GeoPoint): LatLngLiteral {
    return {
      lat: coordinates.latitude,
      lng: coordinates.longitude
    };
  }
}
