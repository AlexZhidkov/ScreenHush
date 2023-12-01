import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { StarRatingModule, StarRatingConfigService } from 'angular-star-rating';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { ActivityComponent } from './activity.component';
import { DataService } from '../services/data.service';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockStarRatingConfigService {
  // You can add mock implementations here if needed
}

class MockMatIconRegistry {
  getNamedSvgIcon(name: string, namespace: string): Observable<SVGElement> {
    // Your implementation, you might return a mocked SVGElement
    return of(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
  }
  addSvgIcon(iconName: string, sanitizer: DomSanitizer) {
    // Mock implementation
  }
  getDefaultFontSetClass() {
    return 'mat-font-icon';
  }
}

describe('ActivityComponent', () => {
  let component: ActivityComponent;
  let fixture: ComponentFixture<ActivityComponent>;
  let mockDataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('DataService', ['getActivityById']);
    mockDataService.getActivityById.and.returnValue(of({ /* mock activity data */ }));

    await TestBed.configureTestingModule({
      declarations: [ActivityComponent],
      imports: [MatMenuModule, MatIconModule, StarRatingModule, MatListModule, MatExpansionModule, BrowserAnimationsModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '123' } } } },
        { provide: DataService, useValue: mockDataService },
        { provide: Location, useValue: { back: () => {} } },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        { provide: DomSanitizer, useClass: class { bypassSecurityTrustResourceUrl() {} } },
        { provide: StarRatingConfigService, useClass: MockStarRatingConfigService },
      ],
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
    expect(mockDataService.getActivityById).toHaveBeenCalledWith('123');
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
