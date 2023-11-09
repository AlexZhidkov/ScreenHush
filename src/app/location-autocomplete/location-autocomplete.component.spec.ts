import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LocationAutocompleteComponent } from './location-autocomplete.component';
import { GeolocationService } from '../services/geolocation.service';
import { of } from 'rxjs';

describe('LocationAutocompleteComponent', () => {
  let component: LocationAutocompleteComponent;
  let fixture: ComponentFixture<LocationAutocompleteComponent>;

  // Create a mock service with a mocked getPredictions method
  const geolocationServiceMock = {
    getPredictions: jasmine.createSpy('getPredictions').and.returnValue(of([])),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationAutocompleteComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: GeolocationService, useValue: geolocationServiceMock },
      ],
    });
    fixture = TestBed.createComponent(LocationAutocompleteComponent);a
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the searchInput form control', () => {
    expect(component.searchInput).toBeInstanceOf(FormControl);
  });

  it('should initialize suggestions with an empty array', () => {
    expect(component.suggestions).toBeDefined();
    component.suggestions.subscribe((suggestions) => {
      expect(suggestions).toEqual([]);
    });
  });

  it('should set error message when server error occurs', () => {
    component.searchInput.setErrors({ serverError: true });
    expect(component.getErrorMessage()).toBe('Error searching for locations, please try again later.');
  });

  it('should reset error message when no server error occurs', () => {
    component.searchInput.setErrors({ serverError: true });
    component.searchInput.setErrors(null);
    expect(component.getErrorMessage()).toBe('');
  });

  it('should call geolocationService.getPredictions when searchInput changes', fakeAsync(() => {
    component.searchInput.setValue('Sydney');
    tick(300); // Simulate a debounce time

    expect(geolocationServiceMock.getPredictions).toHaveBeenCalledWith('Sydney');
  }));
});
