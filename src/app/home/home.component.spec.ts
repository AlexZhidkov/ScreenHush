import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { TagsService } from '../services/tags.service';
import { FilterService } from '../services/filter.service';
import { DataService } from '../services/data.service';
import { of } from 'rxjs';
import { HomeSection } from '../model/home-activity-model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  // Mock services
  const screenHushServiceMock = {
    getAllTags: () => ['tag1', 'tag2'],
  };

  const filterServiceMock = {
    filterSource$: of(),
    updateData: jasmine.createSpy('updateData'),
  };

  const dataServiceMock = {
    getGeoActivitiesBySection: jasmine.createSpy('getGeoActivitiesBySection').and.returnValue(Promise.resolve([] as HomeSection[])),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [MatProgressBarModule, MatCardModule, MatIconModule],
      providers: [
        { provide: TagsService, useValue: screenHushServiceMock },
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

  it('should handle filter changes without updating data if not using current location', fakeAsync(() => {
    const filterService = TestBed.inject(FilterService) as FilterService;
    filterService.updateData({ UseCurrentLocation: false });

    expect(filterService.updateData).toHaveBeenCalledOnceWith({ UseCurrentLocation: false });

    // Advance the virtual clock
    tick();

    // Expectations
    expect(dataServiceMock.getGeoActivitiesBySection).not.toHaveBeenCalled();

    flush();
  }));
});
