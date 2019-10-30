import { Component, OnInit, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import cardJson from './mock/card';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'my-app';
  cardJson = cardJson;
  constructor(public router: Router, public activatedRoute: ActivatedRoute, ) {

  }

  ngOnInit() {


  }

}
