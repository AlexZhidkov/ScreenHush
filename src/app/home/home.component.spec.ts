import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ScreenHushService } from '../screen-hush.service';
import { FilterService } from '../services/filter.service';
import { DataService } from '../services/data.service';
import { of } from 'rxjs';
import { HomeSection } from '../model/home-activity-model';
import { MatProgressBarModule } from '@angular/material/progress-bar';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  // Mock services
  const screenHushServiceMock = {
    getAllTags: () => ['tag1', 'tag2'],
  };

  const filterServiceMock = {
    filterSource$: of(), // You can set up the observable with test data if needed
    updateData: jasmine.createSpy('updateData'),
  };

  const dataServiceMock = {
    getGeoActivitiesBySection: jasmine.createSpy('getGeoActivitiesBySection').and.returnValue(Promise.resolve([] as HomeSection[])),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [MatProgressBarModule],
      providers: [
        { provide: ScreenHushService, useValue: screenHushServiceMock },
        { provide: FilterService, useValue: filterServiceMock },
        { provide: DataService, useValue: dataServiceMock },
      ],
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state', () => {
    expect(component.isLoading).toBe(true);
  });

  it('should handle filter changes and update data', () => {
    const filterService = TestBed.inject(FilterService) as FilterService;
    filterService.updateData({ UseCurrentLocation: true });

    expect(filterService.updateData).toHaveBeenCalledOnceWith({ UseCurrentLocation: true });

    // Wait for async data loading
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(dataServiceMock.getGeoActivitiesBySection).toHaveBeenCalledOnceWith(component.center);
      expect(component.homeSection).toEqual([] as HomeSection[]);
      expect(component.isLoading).toBe(false);
    });
  });

  it('should handle filter changes without updating data if not using current location', () => {
    const filterService = TestBed.inject(FilterService) as FilterService;
    filterService.updateData({ UseCurrentLocation: false });

    expect(filterService.updateData).toHaveBeenCalledOnceWith({ UseCurrentLocation: false });

    // Data loading should not be triggered
    expect(dataServiceMock.getGeoActivitiesBySection).not.toHaveBeenCalled();
  });

  it('should clear the scroll interval on component destruction', () => {
    spyOn(window, 'clearInterval');

    // Assuming that ngAfterViewInit starts the scroll interval
    component.ngAfterViewInit();
    component.ngOnDestroy();

    // Expect clearInterval to be called with the correct interval ID
    expect(window.clearInterval).toHaveBeenCalledOnceWith(component.scrollInterval);
  });
});
