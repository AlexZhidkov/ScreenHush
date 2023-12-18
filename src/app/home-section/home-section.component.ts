import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { HomeSection } from '../model/home-activity-model';
import { Subscription, interval } from 'rxjs';
import { L } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-home-section',
  templateUrl: './home-section.component.html',
  styleUrls: ['./home-section.component.scss'],
})
export class HomeSectionComponent implements OnInit, OnDestroy {
  @ViewChild('nav', { read: DragScrollComponent }) ds: DragScrollComponent;
  @Input() section: HomeSection;
  @Input() isMobile: boolean;
  @Input() index: number;

  private sub: Subscription;

  currentIndex = 0;
  numberOfItems: number;
  numberToScroll = 3;
  timeToScroll = 3000;
  enableScrollButtons = true;
  showScrollButtons = false;
  showLeftScrollButton = false;
  showRightScrollButton = true;

  constructor() {
    this.enableScrollButtons = !this.isMobile;
  }

  dragStart() {
    this.clearScrollInterval();
  }

  moveLeft() {
    this.move(-this.numberToScroll);
  }

  moveRight() {
    this.move(this.numberToScroll);
  }

  move(offset: number) {
    this.clearScrollInterval();
    const newIndex = this.calculateNewIndex(offset);
    this.currentIndex = newIndex;
    this.ds.moveTo(newIndex);
  }

  calculateNewIndex(offset: number): number {
    return Math.min(Math.max(this.currentIndex + offset, 0), this.numberOfItems - 1);
  }

  ngAfterViewInit() {
    this.initScrollInterval();
  }

  clearScrollInterval() {
    this.sub.unsubscribe();
  }

  initScrollInterval() {
    this.sub = interval((Math.random() * 7000 + this.index * this.timeToScroll)).subscribe(count => {
      this.ds.moveRight();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.setNumberToScroll();
  }

  setNumberToScroll(): void {
    const screenWidth = window.innerWidth;

    if (screenWidth < 768) {
      this.numberToScroll = 1;
    } else if (screenWidth < 992) {
      this.numberToScroll = 2;
    } else if (screenWidth < 1800) {
      this.numberToScroll = 3;
    } else {
      this.numberToScroll = 4;
    }
  }

  displayScrollButtons() {
    this.showScrollButtons = true;
  }

  hideScrollButtons() {
    this.showScrollButtons = false;
  }
  
  ngOnInit() {
    this.numberOfItems = this.section ? this.section.items.length : 0;
    this.setNumberToScroll();
  }

  ngOnDestroy(): void {
    this.clearScrollInterval();
  }

  reachesRight(reachesRightBound: boolean) {
    this.showRightScrollButton = !reachesRightBound;

    if (!this.sub.closed && reachesRightBound) {
      setTimeout(() => {
        this.ds.moveTo(0);
      }, 1500);
    }
  }

  reachesLeft(reachesLeftBound: boolean) {
    this.showLeftScrollButton = !reachesLeftBound;
  }
}
