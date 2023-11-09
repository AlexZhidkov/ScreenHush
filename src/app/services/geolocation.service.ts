import { Injectable } from '@angular/core';
import { Observable, defer, from, switchMap } from 'rxjs';
import { AutocompleteResult } from '../model/autocomplete-result.model';
import { GeoLocationResult } from '../model/geolocation-result.model';
import { GoogleLoaderService } from './google-loader.service';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private defaultLocations = [];
  private defaultGeolocationResult = [{ latitude: 0, longitude: 0 }];

  constructor(private googleLoader: GoogleLoaderService) { }

  getPredictions(input: string | null): Observable<AutocompleteResult[]> {
    return defer(() => {
      if (input === null) {
        return from([this.defaultLocations]);
      } else {
        return new Observable<AutocompleteResult[]>((observer) => {
          const request = {
            input,
            componentRestrictions: { country: 'au' },
            types: ['administrative_area_level_1', 'locality', 'postal_code'],
            fields: ['place_id', 'description'],
          };
          this.googleLoader.autocompleteService.getPlacePredictions(
            request,
            (predictions, status) => {
              if (
                status !== google.maps.places.PlacesServiceStatus.OK ||
                !predictions
              ) {
                console.error('Error fetching predictions');
                // If enabled, this will cause the location autocomplete to stop working
                // after the search string wasn't found in the Google Maps API
                // observer.error('Error fetching predictions');
              } else {
                const suggestions: AutocompleteResult[] = predictions.map(
                  (prediction) => ({
                    placeId: prediction.place_id,
                    description: prediction.description,
                  })
                );
                observer.next(suggestions);
              }
              observer.complete();
            }
          );
        });
      }
    });
  }

  getGeoLocation(placeId: string): Promise<GeoLocationResult[]> {
    return new Promise<GeoLocationResult[]>((resolve, reject) => {
      if (placeId === null) {
        reject(this.defaultGeolocationResult);
      } else {
        this.googleLoader.geoCodingService.geocode(
          { placeId },
          (geocoderResult, status) => {
            if (status !== google.maps.GeocoderStatus.OK || !geocoderResult) {
              resolve(this.defaultGeolocationResult);
            } else {
              const result = geocoderResult.map((res) => ({
                latitude: res.geometry.location.lat(),
                longitude: res.geometry.location.lng(),
              }));
              resolve(result);
            }
          }
        );
      }
    });
  }
}
