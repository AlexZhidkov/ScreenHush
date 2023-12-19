import { Component, Input, OnInit } from '@angular/core';
import { Activity } from '../model/activity';

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss'],
})
export class ActivityCardComponent implements OnInit {
  @Input()
  activity: Activity;
  @Input()
  canEdit: boolean;

  tipClass: string = ''; // Initialize componentClass property
  tipText: string = 'Free';
  
  ngOnInit() {
    const percentageGreen = 60;
    const percentageYellow = 30;
    const randomPercentage = Math.random() * 100;

    let tipClass = 'tooltip';

    if (randomPercentage < percentageGreen) {
      tipClass += ' green';
      this.tipText = 'Free';
    } else if (randomPercentage < percentageGreen + percentageYellow) {
      tipClass += ' yellow';
      this.tipText = 'Usually Free';
    } else {
      tipClass += ' red';
      this.tipText = '$5-$15';
    }

    this.tipClass = tipClass;
  }
}
