import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { environment } from '../environments/environment';
firebase.initializeApp(environment.firebase);

import { AppComponent } from './app.component';
import { LocationService } from './services/location.service';
import { RestaurantsService } from './services/restaurants.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: environment.firebase.apiKey,
    }),
  ],
  providers: [LocationService, RestaurantsService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private _ls: LocationService, private _rs: RestaurantsService) {}
}
