import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoogleLoaderService {
  onGooglelibrariesDidLoad$ = new BehaviorSubject<boolean>(false);
  private loader: Loader;
  geoCodingService: google.maps.Geocoder;
  autocompleteService: google.maps.places.AutocompleteService;

  constructor() {
    this.loader = new Loader({
      apiKey: "[APIKEY]",
      version: "weekly",
      libraries: ["places", "geocoding"]
    });

    this.loadLibraries();
  }

  private async loadLibraries(): Promise<void> {
    const geocodingPromise = this.loader.importLibrary('geocoding');
    const placesPromise = this.loader.importLibrary('places');

    return Promise.all([geocodingPromise, placesPromise])
      .then(() => {
        this.geoCodingService = new google.maps.Geocoder();
        this.autocompleteService = new google.maps.places.AutocompleteService();

        this.onGooglelibrariesDidLoad$.next(true);
      })
      .catch((e) => {
        this.onGooglelibrariesDidLoad$.next(false);
        console.log("Error loading google libraries");
      });
  }
}
