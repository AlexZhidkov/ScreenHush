import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { GeolocationService } from '../services/geolocation.service';
import { Observable, switchMap, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AutocompleteResult } from '../model/autocomplete-result.model';

@Component({
  selector: 'app-location-autocomplete',
  templateUrl: './location-autocomplete.component.html',
  styleUrls: ['./location-autocomplete.component.scss'],
})
export class LocationautocompleteComponent {
  @Output() selectedLocation = new EventEmitter<AutocompleteResult>();
  constructor(private geolocationService: GeolocationService) {}
  suggestions: Observable<AutocompleteResult[]>;
  searchInput = new FormControl('');

  ngOnInit() {
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
