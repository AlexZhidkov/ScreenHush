import { ComponentFixture, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, convertToParamMap } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterTestingModule } from '@angular/router/testing';
import { Auth } from '@angular/fire/auth';
import { Storage } from '@angular/fire/storage';
import { Observable, from, of } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ActivityEditComponent } from './activity-edit.component';
import { TagsService } from '../services/tags.service';
import { ActivitiesService } from '../services/activities.service';

const activatedRouteSnapshot: ActivatedRouteSnapshot = {
  url: [],
  params: {},
  queryParams: {},
  fragment: null,
  data: {},
  outlet: 'primary',
  component: null,
  routeConfig: null,
  get title() { return 'Your Title'; },
  get root() { return activatedRouteSnapshot; },
  get parent() { return null; },
  get firstChild() { return null; },
  get children() { return []; },
  get pathFromRoot() { return [activatedRouteSnapshot]; },
  get paramMap() { return convertToParamMap({}); },
  get queryParamMap() { return convertToParamMap({}); },
  toString: () => 'Your Snapshot String',
};

describe('ActivityEditComponent', () => {
  let component: ActivityEditComponent;
  let fixture: ComponentFixture<ActivityEditComponent>;
  let mockRouter: Partial<Router>;
  let mockMatSnackBar: Partial<MatSnackBar>;
  let mockDomSanitizer: Partial<DomSanitizer>;
  let mockTagsService: Partial<TagsService>;
  let mockActivitiesService: Partial<ActivitiesService>;
  let mockLiveAnnouncer: Partial<LiveAnnouncer>;

  beforeEach(waitForAsync(() => {
    const authMock = {};
    const storageMock = {};

    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockMatSnackBar = { open: jasmine.createSpy('open') };
    mockDomSanitizer = { bypassSecurityTrustResourceUrl: (url: string) => url };
    mockTagsService = { getAllTags: () => ['tag1', 'tag2'] };
    mockActivitiesService = {
      getActivityDoc: jasmine.createSpy('getActivityDoc').and.returnValue({
        onSnapshot: (callback: any) => callback({ data: () => ({}) }),
      }),
      updateActivity: jasmine.createSpy('updateActivity'),
      deleteActivity: jasmine.createSpy('deleteActivity').and.returnValue(Promise.resolve()),
    };
    mockLiveAnnouncer = { announce: jasmine.createSpy('announce') };

    TestBed.configureTestingModule({
      declarations: [ActivityEditComponent],
      imports: [
        BrowserAnimationsModule,
        MatSnackBarModule,
        MatChipsModule,
        MatAutocompleteModule,
        ReactiveFormsModule, // Import ReactiveFormsModule
        FormsModule,
        RouterTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatIconModule,
        MatProgressBarModule
      ],
      providers: [
        { provide: Auth, useValue: authMock },
        { provide: Storage, useValue: storageMock },
        { provide: ActivatedRoute, useValue: {
            params: from([{id: 1}]),
            paramMap: of(convertToParamMap({id: 1})),
            snapshot: activatedRouteSnapshot,
          },
        },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: DomSanitizer, useValue: mockDomSanitizer },
        { provide: TagsService, useValue: mockTagsService },
        { provide: ActivitiesService, useValue: mockActivitiesService },
        { provide: LiveAnnouncer, useValue: mockLiveAnnouncer },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
