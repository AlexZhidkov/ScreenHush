import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, flush, tick } from '@angular/core/testing';
import { DragScrollModule } from 'ngx-drag-scroll';
import { HomeSection } from '../model/home-activity-model';
import { HomeSectionComponent } from './home-section.component';

describe('HomeSectionComponent', () => {
  let component: HomeSectionComponent;
  let fixture: ComponentFixture<HomeSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeSectionComponent],
      imports: [DragScrollModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeSectionComponent);
    component = fixture.componentInstance;
    component.section = { items: [{}, {}, {}] } as HomeSection;
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the number to scroll based on screen width', () => {
    spyOn(component, 'setNumberToScroll');
    component.onResize(new Event('resize'));
    expect(component.setNumberToScroll).toHaveBeenCalled();
  });

  it('should move right', () => {
    spyOn(component, 'move');
    component.moveRight();
    expect(component.move).toHaveBeenCalledWith(component.numberToScroll);
  });

  it('should move left', () => {
    spyOn(component, 'move');
    component.moveLeft();
    expect(component.move).toHaveBeenCalledWith(-component.numberToScroll);
  });

  it('should move to the correct index', () => {
    const newIndex = 2;
    component.numberOfItems = 5;
    component.currentIndex = 1;
    spyOn(component.ds, 'moveTo');
    component.move(newIndex - component.currentIndex);
    expect(component.ds.moveTo).toHaveBeenCalledWith(newIndex);
  });

  it('should stop auto scroll on dragStart', () => {
    spyOn(component, 'clearScrollInterval');
    component.dragStart();
    expect(component.clearScrollInterval).toHaveBeenCalled();
  });

  it('should display scroll buttons', () => {
    component.displayScrollButtons();
    expect(component.showScrollButtons).toBeTruthy();
  });

  it('should hide scroll buttons', () => {
    component.hideScrollButtons();
    expect(component.showScrollButtons).toBeFalsy();
  });

  it('should set the number to scroll to 1 on small screens', fakeAsync(() => {
    const windowSpy = spyOnProperty(window, 'innerWidth', 'get').and.returnValue(767);
    component.setNumberToScroll();
    tick();
    expect(component.numberToScroll).toBe(1);
    windowSpy.calls.reset();
  }));

  it('should set the number to scroll to 2 on medium screens', () => {
    const windowSpy = spyOnProperty(window, 'innerWidth', 'get').and.returnValue(991);
    component.setNumberToScroll();
    expect(component.numberToScroll).toBe(2);
    windowSpy.calls.reset();
  });

  it('should set the number to scroll to 3 on large screens', fakeAsync(() => {
    const windowSpy = spyOnProperty(window, 'innerWidth', 'get').and.returnValue(993);
    component.setNumberToScroll();
    tick();
    expect(component.numberToScroll).toBe(3);
    windowSpy.calls.reset();
  }));
});
