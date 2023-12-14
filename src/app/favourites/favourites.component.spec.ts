import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { FavouritesComponent } from './favourites.component';
import { FavouritesService } from '../services/favourites.service';
import { Activity } from '../model/activity';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../services/authentication.service';
import { of } from 'rxjs';
import { ActivityCardComponent } from '../activity-card/activity-card.component';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';

describe('FavouritesComponent', () => {
  let component: FavouritesComponent;
  let fixture: ComponentFixture<FavouritesComponent>;
  let mockFavouritesService: jasmine.SpyObj<FavouritesService>;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;

  beforeEach(() => {
    mockFavouritesService = jasmine.createSpyObj('FavouritesService', [
      'getFavouriteActivities',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthenticationService', [
      'currentAuthStatus',
    ]);

    TestBed.configureTestingModule({
      declarations: [FavouritesComponent, ActivityCardComponent],
      imports: [MatIconModule, MatCardModule, RouterTestingModule],
      providers: [
        { provide: FavouritesService, useValue: mockFavouritesService },
        { provide: AuthenticationService, useValue: mockAuthService },
      ],
    });

    fixture = TestBed.createComponent(FavouritesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display favourites on initialization', waitForAsync(async () => {
    const mockActivities: Activity[] = [
      {
        id: 1,
        title: 'Activity 1',
        icon: 'icon1',
        mapsUrl: 'url1',
        address: 'address1',
        distanceInKm: 1,
        activity: 'activity1',
        tags: ['tag1', 'tag2'],
        imageUrl: 'image1.jpg',
      },
      {
        id: 2,
        title: 'Activity 2',
        icon: 'icon2',
        mapsUrl: 'url2',
        address: 'address2',
        distanceInKm: 2,
        activity: 'activity2',
        tags: ['tag3', 'tag4'],
        imageUrl: 'image2.jpg',
      },
    ];

    mockFavouritesService.getFavouriteActivities.and.returnValue(
      Promise.resolve(mockActivities)
    );

    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges(); // Detect changes again to make sure the UI is updated

    expect(component.favourites).toEqual(mockActivities);
  }));
});
