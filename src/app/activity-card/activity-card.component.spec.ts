import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCardComponent } from './activity-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { mockActivity } from '../mocks/mock-activity';
import { AppRoutingModule } from '../app-routing.module';

describe('ActivityCardComponent', () => {
  let component: ActivityCardComponent;
  let fixture: ComponentFixture<ActivityCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityCardComponent],
      imports: [MatCardModule, MatIconModule, AppRoutingModule],
    });

    fixture = TestBed.createComponent(ActivityCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.activity = mockActivity;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
