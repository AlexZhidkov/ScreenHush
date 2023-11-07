import { Injectable } from '@angular/core';
import { Observable, defer, from } from 'rxjs';
import { AutocompleteResult } from '../model/autocomplete-result.model';
import { GeoLocationResult } from '../model/geolocation-result.model';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private autocompleteService = new google.maps.places.AutocompleteService();
  private geocoder = new google.maps.Geocoder();
  private defaultLocations = [];
  private defaultGeolocationResult = [{ latitude: 0, longitude: 0 }];

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
            fields: ['place_id', 'description']
          }
          this.autocompleteService.getPlacePredictions(request, (predictions, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
              console.error('Error fetching predictions');
            } else {
              const suggestions: AutocompleteResult[] = predictions.map((prediction) => ({
                placeId: prediction.place_id,
                description: prediction.description,
              }));
              observer.next(suggestions);
            }
            observer.complete();
          });
        });
      }
    });
  }

  getGeoLocation(placeId: string): Promise<GeoLocationResult[]> {
    return new Promise<GeoLocationResult[]>((resolve, reject) => {
      if (placeId === null) {
        reject(this.defaultGeolocationResult);
      } else {
        this.geocoder.geocode({ placeId }, (geocoderResult, status) => {
          if (status !== google.maps.GeocoderStatus.OK || !geocoderResult) {
            resolve(this.defaultGeolocationResult);
          } else {
            const result = geocoderResult.map((res) => ({
              latitude: res.geometry.location.lat(),
              longitude: res.geometry.location.lng(),
            }));
            resolve(result);
          }
        });
      }
    });
  }
}
