import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { LatLngLiteral } from '@agm/core';

@Injectable()
export class LocationService {
  private _coordinates: BehaviorSubject<LatLngLiteral> = new BehaviorSubject<LatLngLiteral>({ lat: 0, lng: 0 });
  private _locationWatch: number;
  private _mapCenter: BehaviorSubject<LatLngLiteral> = new BehaviorSubject<LatLngLiteral>({ lat: 0, lng: 0 });
  private _watching: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _updating: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {
    this._getLocation();
  }

  get coordinates(): Observable<LatLngLiteral> {
    return this._coordinates.asObservable();
  }

  get mapCenter(): Observable<LatLngLiteral> {
    return this._mapCenter.asObservable();
  }

  get updating(): Observable<any> {
    return this._updating.asObservable();
  }

  get watching(): Observable<any> {
    return this._watching.asObservable();
  }

  private _getLocation(): void {
    if ((typeof window !== 'undefined') && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((success: any) => {
        this._coordinates.next({ lat: success.coords.latitude, lng: success.coords.longitude });
        this.watchStart();
      }, (error: any) => {
        console.log(error);
      });
    }
  }

  public updateMapCenter(coordinates: LatLngLiteral): void {
    this._mapCenter.next(coordinates);
  }

  public updatingStart(): void {
    this._mapCenter.next(this._coordinates.value);
    this._updating.next(true);
  }

  public updatingStop(): void {
    this._updating.next(false);
  }

  public watchStart(): void {
    if ((typeof window !== 'undefined') && ('geolocation' in navigator) && !this._locationWatch) {
      this._locationWatch = navigator.geolocation.watchPosition((success: any) => {
        this._coordinates.next({ lat: success.coords.latitude, lng: success.coords.longitude });
        if (this._updating.value) { this._mapCenter.next(this._coordinates.value); }
      }, (error: any) => {
        console.warn(error);
      }, { enableHighAccuracy: true, timeout: 500000, maximumAge: 1 });
      this._watching.next(true);
      this._updating.next(true);
    }
  }

  public watchStop(): void {
    if ((typeof window !== 'undefined') && ('geolocation' in navigator) && this._locationWatch) {
      navigator.geolocation.clearWatch(this._locationWatch);
      this._watching.next(false);
      this._updating.next(false);
    }
  }
}