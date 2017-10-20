
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LatLngLiteral } from '@agm/core';
import { Geokit } from 'geokit';
import 'rxjs/add/operator/first';

import { LocationService } from '../services/location.service';
import { RestaurantsService } from '../services/restaurants.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private _geoKit: Geokit = new Geokit();
  private _lastOpen: string;

  constructor(private _ls: LocationService, private _rs: RestaurantsService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._ls.updatingStart();
  }

  get coordsMap(): Observable<LatLngLiteral> {
    return this._ls.mapCenter;
  }

  get coordsUser(): Observable<LatLngLiteral> {
    return this._ls.coordinates;
  }

  get nearMapCenter(): Observable<any[]> {
    return this._rs.nearMapCenter;
  }

  get restaurant(): Observable<any> {
    return this._rs.restaurant;
  }

  get updating(): Observable<boolean> {
    return this._ls.updating;
  }

  public centerChange(coordinates: LatLngLiteral): void {
    this._ls.updateMapCenter(coordinates);
  }

  public clickedMarker(id: string): void {
    this._ls.updatingStop();
    this._rs.updateRestaurant(id);
    this._lastOpen = id;
  }

  public distance(start: LatLngLiteral, destination: LatLngLiteral): string {
    return this._geoKit.distance(start, destination, 'miles').toFixed(1);
  }

  public isOpen(id: string): boolean {
    return (this._lastOpen === id);
  }

  public swipe(event: any): void {
    this._ls.updatingStop();
  }

  public toggleWatch(): void {
    this._ls.updating.first().subscribe((state: boolean) => {
      (state) ? this._ls.updatingStop() : this._ls.updatingStart();
    });
  }
}
