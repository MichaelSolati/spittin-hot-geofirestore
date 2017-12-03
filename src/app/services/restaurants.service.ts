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
  private _geoFire: any;
  private _geoKit: Geokit = new Geokit();
  private _previousCoords: LatLngLiteral = { lat: 0, lng: 0 };
  private _restaurant: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private _restaurants: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private _ls: LocationService) {
    this._geoFire = new GeoFire(firebase.database().ref('geofire/restaurants'));
    this._ls.mapCenter.subscribe((coords: LatLngLiteral) => {
      if (this._geoKit.distance(coords, this._previousCoords) > 0.5) {
        this._previousCoords = coords;
        this._geoFetch(coords);
      }
    });
  }

  get restaurant(): Observable<any> {
    return this._restaurant.asObservable();
  }

  get restaurants(): Observable<any[]> {
    return this._restaurants.asObservable();
  }

  private _geoFetch(coords: LatLngLiteral): void {
    const max = 100;
    this._geoFire.query({
      center: [coords.lat, coords.lng],
      radius: 0.5
    }).on('key_entered', (key: string, result: any[]) => {
      let places: any[] = [...this._restaurants.value];
      const newPlace: any = { 'id': key, 'coords': { 'lat': result[0], 'lng': result[1] } };
      if (places.find((place: any) => place.id === newPlace.id)) { return; }
      places.push(newPlace);
      places.map((place: any) => place.distance = this._geoKit.distance(coords, place.coords, 'miles'));
      places = quicksort(places);
      if (places.length > max) { places = places.slice(0, max); }
      this._restaurants.next(places);
    });
  }

  public updateRestaurant(id: string): void {
    firebase.database().ref('restaurants').child(id).on('value', (snapshot: any) => this._restaurant.next(snapshot.val()));
  }
}
