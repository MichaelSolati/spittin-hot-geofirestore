import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import * as GeoFire from 'geofire';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { LatLngLiteral } from '@agm/core';
import { Geokit } from 'geokit';
import 'rxjs/add/operator/map';

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
  private _geoFireRef: any;
  private _geoFire: any;
  private _geoKit: Geokit = new Geokit();
  private _lastQuery: LatLngLiteral = { lat: 0, lng: 0 };
  private _nearMapCenter: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private _restaurant: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private _restaurantsRef: any;

  constructor(private _ls: LocationService) {
    this._restaurantsRef = firebase.database().ref('restaurants');
    this._geoFireRef = firebase.database().ref('geofire/restaurants');
    this._geoFire = new GeoFire(this._geoFireRef);
    this._ls.mapCenter.subscribe((coords: LatLngLiteral) => {
      if (this._geoKit.distance(coords, this._lastQuery) > 0.5) {
        this._lastQuery = coords;
        this._geoFetch(coords, 5, this._nearMapCenter);
      }
    });
  }

  get restaurant(): Observable<any> {
    return this._restaurant.asObservable();
  }

  get nearMapCenter(): Observable<any[]> {
    return this._nearMapCenter.asObservable();
  }

  private _geoFetch(coords: LatLngLiteral, radius: number, store: BehaviorSubject<any[]>): void {
    const max = 50;
    this._geoFire.query({
      center: [coords.lat, coords.lng],
      radius: radius
    }).on('key_entered', (key: string, result: any[]) => {
      let places: any[] = [...store.value];
      const newPlace: any = { 'id': key, 'coords': { 'lat': result[0], 'lng': result[1] } };
      if (places.find((place: any) => place.id === newPlace.id)) { return; }
      places.push(newPlace);
      places.map((place: any) => place.distance = this._geoKit.distance(coords, place.coords, 'miles'));
      places = quicksort(places).reverse();
      if (places.length > max) { places = places.slice(places.length - max, places.length); }
      store.next(places);
    });
  }

  public updateRestaurant(id: string): void {
    this._restaurantsRef.child(id).on('value', (snapshot: any) => this._restaurant.next(snapshot.val()));
  }
}
