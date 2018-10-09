import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { environment } from '../environments/environment';
firebase.initializeApp(environment.firebase);
firebase.firestore().settings({ timestampsInSnapshots: true });

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { LocationService } from './services/location.service';
import { RestaurantsService } from './services/restaurants.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: environment.firebase.apiKey
    })
  ],
  providers: [
    LocationService,
    RestaurantsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private _ls: LocationService, private _rs: RestaurantsService) { }
}
