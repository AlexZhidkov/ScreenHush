import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { AuthenticationService } from '../services/authentication.service';
import { HomeService } from '../services/home.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockFirebaseService: jasmine.SpyObj<AuthenticationService>;
  let mockHomeService: jasmine.SpyObj<HomeService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      providers: [
        { provide: AuthenticationService, useValue: mockFirebaseService },
        { provide: HomeService, useValue: mockHomeService },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
