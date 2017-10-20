import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import * as firebase from 'firebase';

import { environment } from '../environments/environment';
firebase.initializeApp(environment.firebase);

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
    BrowserAnimationsModule,
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
  constructor(private _ls: LocationService, private _rs: RestaurantsService) {}
}
