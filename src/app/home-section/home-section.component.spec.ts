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

  it('should move left', () => {
    spyOn(component, 'move');
    component.moveLeft();
    expect(component.move).toHaveBeenCalledWith(-component.numberToScroll);
  });

  it('should move right', fakeAsync(() => {
    const moveSpy = spyOn(component, 'move').and.callThrough();
  
    component.ngAfterViewInit();
    fixture.detectChanges();
  
    tick(6000);
  
    expect(moveSpy).toHaveBeenCalled();
    expect(moveSpy.calls.mostRecent().args[0]).toBe(component.numberToScroll);
  
    component.autoScroll = false;
    flush();
    tick();
    discardPeriodicTasks();
  }));

  it('should move to the correct index', () => {
    const newIndex = 2;
    component.numberOfItems = 5;
    component.currentIndex = 1;
    spyOn(component.ds, 'moveTo');
    component.move(newIndex - component.currentIndex);
    expect(component.ds.moveTo).toHaveBeenCalledWith(newIndex);
  });

  it('should start auto scroll on ngAfterViewInit', () => {
    jasmine.clock().install();
    spyOn(component, 'moveRight');
    component.ngAfterViewInit();
    jasmine.clock().tick(5001);
    expect(component.moveRight).toHaveBeenCalled();
  });

  it('should stop auto scroll on dragStart', () => {
    component.autoScroll = true;
    spyOn(window, 'clearInterval');
    component.dragStart();
    expect(component.autoScroll).toBeFalsy();
    expect(window.clearInterval).toHaveBeenCalled();
  });

  it('should display scroll buttons', () => {
    component.displayScrollButtons();
    expect(component.showScrollButtons).toBeTruthy();
  });

  it('should hide scroll buttons', () => {
    component.hideScrollButtons();
    expect(component.showScrollButtons).toBeFalsy();
  });

  it('should set the number to scroll to 1 on small screens', () => {
    const windowSpy = spyOnProperty(window, 'innerWidth', 'get').and.returnValue(767);
    component.setNumberToScroll();
    fixture.detectChanges();
    
    setTimeout(() => {
      expect(component.numberToScroll).toBe(1);
      windowSpy.calls.reset();
    }, 0);
  });

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
