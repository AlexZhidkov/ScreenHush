import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, switchMap, of, BehaviorSubject } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { AutocompleteResult } from '../model/autocomplete-result.model';
import { GoogleLoaderService } from '../services/google-loader.service';
import { GeolocationService } from '../services/geolocation.service';

@Component({
  selector: 'app-location-autocomplete',
  templateUrl: './location-autocomplete.component.html',
  styleUrls: ['./location-autocomplete.component.scss'],
})
export class LocationAutocompleteComponent {
  @Output() selectedLocation = new EventEmitter<AutocompleteResult>();
  constructor(private geolocationService: GeolocationService, private googleLoaderService: GoogleLoaderService) { }
  suggestions: Observable<AutocompleteResult[]>;
  searchInput = new FormControl('');
  isGoogleLibrariesLoaded: boolean = false;

  ngOnInit() {
    this.googleLoaderService.onGoogleLibrariesDidLoad$.subscribe((loaded) => {
      this.isGoogleLibrariesLoaded = loaded;
    });

    this.suggestions = this.searchInput.valueChanges.pipe(
      startWith(''),
      switchMap((value) => this.geolocationService.getPredictions(value)),
      catchError((error) => {
        console.log(error);
        this.searchInput.setErrors({ serverError: true });
        return of([]);
      })
    );
  }

  getErrorMessage() {
    return this.searchInput.hasError('serverError') ? "Error searching for locations, please try again later." : "";
  }
}
