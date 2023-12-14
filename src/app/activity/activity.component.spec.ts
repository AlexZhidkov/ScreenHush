import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { StarRatingConfigService, StarRatingModule } from 'angular-star-rating';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { ActivityComponent } from './activity.component';
import { ActivitiesService } from '../services/activities.service';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FavouritesService } from '../services/favourites.service';

class MockStarRatingConfigService {
  // You can add mock implementations here if needed
}

const mockFavouritesService = jasmine.createSpyObj('FavouritesService', [
  'isActivityFavorited',
  'addToFavourites',
  'removeFromFavourites',
]);

describe('ActivityComponent', () => {
  let component: ActivityComponent;
  let fixture: ComponentFixture<ActivityComponent>;
  let mockActivitiesService: jasmine.SpyObj<ActivitiesService>;

  beforeEach(async () => {
    mockActivitiesService = jasmine.createSpyObj('DataService', ['getActivityById']);
    mockActivitiesService.getActivityById.and.returnValue(
      of({
        /* mock activity data */
      })
    );

    await TestBed.configureTestingModule({
      declarations: [ActivityComponent],
      imports: [
        MatCardModule,
        MatMenuModule,
        MatIconModule,
        StarRatingModule,
        MatListModule,
        MatExpansionModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatIconTestingModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '123' } } },
        },
        { provide: ActivitiesService, useValue: mockActivitiesService },
        { provide: Location, useValue: { back: () => {} } },
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustResourceUrl: (url: string) => url,
          },
        },
        {
          provide: StarRatingConfigService,
          useClass: MockStarRatingConfigService,
        },
        { provide: FavouritesService, useValue: mockFavouritesService },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Add this line to ignore unknown elements
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch activity data on initialization', () => {
    expect(mockActivitiesService.getActivityById).toHaveBeenCalledWith('123');
    expect(component.activityDoc$).toBeDefined();
    // You can further test the behavior based on the fetched data
  });

  it('should navigate back when goBackToPrevPage is called', () => {
    const location = TestBed.inject(Location);
    const locationBackSpy = spyOn(location, 'back');

    component.goBackToPrevPage();

    expect(locationBackSpy).toHaveBeenCalled();
  });

  // Add more tests to cover other functionalities, template rendering, event handling, etc.
});
