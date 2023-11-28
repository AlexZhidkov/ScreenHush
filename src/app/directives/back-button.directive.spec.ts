import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NavigationService } from '../services/navigation.service';
import { BackButtonDirective } from './back-button.directive';

// Mock NavigationService
class MockNavigationService {
  back(): void {
    // Mock implementation
  }
}

@Component({
  template: '<button backButton></button>',
})
class TestComponent {}

describe('BackButtonDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let buttonDebugElement: DebugElement;
  let navigationService: NavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, BackButtonDirective],
      providers: [{ provide: NavigationService, useClass: MockNavigationService }],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    buttonDebugElement = fixture.debugElement.query(By.directive(BackButtonDirective));
    navigationService = TestBed.inject(NavigationService);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new BackButtonDirective(navigationService);
    expect(directive).toBeTruthy();
  });

  it('should call navigation.back() when the button is clicked', () => {
    const spy = spyOn(navigationService, 'back');
    buttonDebugElement.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalled();
  });

  it('should have the correct selector applied', () => {
    expect(buttonDebugElement.attributes['backButton']).toBeDefined();
  });
});
