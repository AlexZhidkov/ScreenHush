import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AnalyticsService } from '../services/analytics.service';
import { AuthenticationService } from '../services/authentication.service';
import { AuthFirebaseuiAvatarComponent } from '../auth-firebaseui-avatar/auth-firebaseui-avatar.component';
import { HomeSection } from '../model/home-activity-model';
import { ActivitiesService } from '../services/activities.service';
import { DragScrollModule } from 'ngx-drag-scroll';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockAnalyticsService: jasmine.SpyObj<AnalyticsService>;
  let mockAuthenticationService: jasmine.SpyObj<AuthenticationService>;

  const activityServiceMock = {
    getGeoActivitiesBySection: jasmine.createSpy('getGeoActivitiesBySection').and.returnValue(Promise.resolve([] as HomeSection[])),
  };
  
  beforeEach(() => {
    mockAuthenticationService = jasmine.createSpyObj('FirebaseService', [
      'onAuthStateChanged',
      'logEvent',
    ]);

    TestBed.configureTestingModule({
      declarations: [NavbarComponent, AuthFirebaseuiAvatarComponent],
      imports: [RouterTestingModule, DragScrollModule, MatIconModule, MatMenuModule, MatDividerModule],
      providers: [
        { provide: AnalyticsService, useValue: mockAnalyticsService },
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: ActivitiesService, useValue: activityServiceMock },
      ],
    });
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});