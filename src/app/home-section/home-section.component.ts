import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { HomeSection } from '../model/home-activity-model';

@Component({
  selector: 'app-home-section',
  templateUrl: './home-section.component.html',
  styleUrls: ['./home-section.component.scss'],
})
export class HomeSectionComponent implements OnInit, OnDestroy {
  @ViewChild('nav', { read: DragScrollComponent }) ds: DragScrollComponent;
  @Input() section: HomeSection;
  @Input() isMobile: boolean;

  currentIndex = 0;
  autoScroll = true;
  scrollInterval: any;
  numberOfItems: number;
  numberToScroll = 3;
  enableScrollButtons = true;
  showScrollButtons = false;

  constructor() {
    this.enableScrollButtons = !this.isMobile;
  }

  dragStart() {
    this.autoScroll = false;

    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }
  }

  moveLeft() {
    this.move(-this.numberToScroll);
  }

  moveRight() {
    this.move(this.numberToScroll);
  }

  move(offset: number) {
    this.autoScroll = false;
    const newIndex = Math.min(Math.max(this.currentIndex + offset, 0), this.numberOfItems - 1);
    this.currentIndex = newIndex;
    this.ds.moveTo(newIndex);
  }

  ngAfterViewInit() {
    this.scrollInterval = setInterval(() => {
      if (this.autoScroll) {
        this.moveRight();
      }
    }, 5000);
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
    } else {
      this.numberToScroll = 3;
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
  }

  ngOnDestroy(): void {
    clearInterval(this.scrollInterval);
  }
}
