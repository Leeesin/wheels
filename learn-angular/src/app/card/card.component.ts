import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

enum EMERGENCY {
  label = '紧急外呼',
  value = 'EMERGENCY',
}


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() dataSource: Array<any>;

  currentActiveIndex = 0;
  EMERGENCY = EMERGENCY;
  displayEmergencyMessage = (emergencyArr: Array<any>): string => _.map(emergencyArr, item => _.get(item, 'name')).join(';');

  constructor() { }

  ngOnInit() {
  }

  onChange(i: number) {
    this.currentActiveIndex = i;
  }

}
