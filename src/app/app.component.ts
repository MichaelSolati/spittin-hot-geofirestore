import { Component, OnInit, OnDestroy } from '@angular/core';
import * as firebase from 'firebase/app';
import { Geokit, LatLngLiteral } from 'geokit';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { LocationService } from './services/location.service';
import { RestaurantsService } from './services/restaurants.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private _lastLocation: firebase.firestore.GeoPoint = new firebase.firestore.GeoPoint(
    0,
    0
  );
  private _lastOpen: string;

  constructor(private _ls: LocationService, private _rs: RestaurantsService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this._ls.updatingStart();
  }

  get coordsMap(): Observable<firebase.firestore.GeoPoint> {
    return this._ls.mapCenter;
  }

  get coordsUser(): Observable<firebase.firestore.GeoPoint> {
    return this._ls.coordinates;
  }

  get restaurants(): Observable<any[]> {
    return this._rs.restaurants;
  }

  get updating(): Observable<boolean> {
    return this._ls.updating;
  }

  public centerChange(coordinates: LatLngLiteral): void {
    this._lastLocation = new firebase.firestore.GeoPoint(
      coordinates.lat,
      coordinates.lng
    );

    this.coordsUser
      .pipe(first())
      .subscribe((coords: firebase.firestore.GeoPoint) => {
        if (
          Geokit.distance(
            this._geopoint2Literal(this._lastLocation),
            this._geopoint2Literal(coords)
          ) > 0.005
        ) {
          this._ls.updatingStop();
        }
      });
  }

  public clickedMarker(id: string): void {
    this._lastOpen = id;
  }

  public distance(
    start: firebase.firestore.GeoPoint,
    destination: firebase.firestore.GeoPoint
  ): string {
    return Geokit.distance(
      this._geopoint2Literal(start),
      this._geopoint2Literal(destination),
      'miles'
    ).toFixed(1);
  }

  public idle(): void {
    this._ls.updateMapCenter(this._lastLocation);
  }

  public isOpen(id: string): boolean {
    return this._lastOpen === id;
  }

  public toggleWatch(): void {
    this._ls.updating.pipe(first()).subscribe((state: boolean) => {
      state ? this._ls.updatingStop() : this._ls.updatingStart();
    });
  }

  public trackByFn(index: number, item: any): string {
    return item.$key;
  }

  private _geopoint2Literal(
    coordinates: firebase.firestore.GeoPoint
  ): LatLngLiteral {
    return {
      lat: coordinates.latitude,
      lng: coordinates.longitude,
    };
  }
}
