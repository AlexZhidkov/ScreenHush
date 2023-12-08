import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleLoaderService {
  onGoogleLibrariesDidLoad$ = new BehaviorSubject<boolean>(false);
  private loader: Loader;
  geoCodingService: google.maps.Geocoder;
  autocompleteService: google.maps.places.AutocompleteService;

  constructor() {
    this.loader = new Loader({
      apiKey: environment.googleMapsApiKey,
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

        this.onGoogleLibrariesDidLoad$.next(true);
      })
      .catch((e) => {
        this.onGoogleLibrariesDidLoad$.next(false);
        console.log("Error loading google libraries");
      });
  }
}
