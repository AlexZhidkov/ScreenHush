import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { DragScrollModule } from 'ngx-drag-scroll';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // Add this import
import { AppComponent } from './app.component';
import { AuthenticationService } from './services/authentication.service';
import { AnalyticsService } from './services/analytics.service';
import { mockUser } from './mocks/mock-user';
import { AuthFirebaseuiAvatarComponent } from './auth-firebaseui-avatar/auth-firebaseui-avatar.component';
import { LocationAutocompleteComponent } from './location-autocomplete/location-autocomplete.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let mockAuthenticationService: jasmine.SpyObj<AuthenticationService>;
  let mockAnalyticsService: jasmine.SpyObj<AnalyticsService>;

  beforeEach(() => {
    mockAuthenticationService = jasmine.createSpyObj('FirebaseService', [
      'onAuthStateChanged',
      'logEvent',
    ]);

    TestBed.configureTestingModule({
      declarations: [AppComponent, AuthFirebaseuiAvatarComponent, LocationAutocompleteComponent],
      imports: [
        RouterTestingModule,
        MatIconModule,
        DragScrollModule,
        MatMenuModule,
        MatChipsModule,
        MatSelectModule,
        MatDividerModule,
        MatTooltipModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: AnalyticsService, useValue: mockAnalyticsService },
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'ScreenHush'`, () => {
    expect(component.title).toEqual('ScreenHush');
  });

  it('should render the navbar if User is found', () => {
    mockAuthenticationService.onAuthStateChanged.and.callFake((callback) => callback(mockUser));

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const navbar = compiled.querySelector('.navbar');
    const logo = compiled.querySelector('.logo-container');

    expect(navbar).toBeTruthy();
    expect(logo).toBeTruthy();
  });

  it('should render footer with correct buttons', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
  
    const homeButton = compiled.querySelector('button[routerLink="/"] span');
    const favoritesButton = compiled.querySelector('button[routerLink="/favourites"] span');
    const shopButton = compiled.querySelector('button[routerLink="/shop"] span');
    const historyButton = compiled.querySelector('button[routerLink="/history"] span');
  
    expect(homeButton?.textContent).toContain('Home');
    expect(favoritesButton?.textContent).toContain('Favourites');
    expect(shopButton?.textContent).toContain('Shop');
    expect(historyButton?.textContent).toContain('History');
  });

  afterEach(() => {
    fixture.destroy();
  });
});
