import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Event, Router, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-demo2',
  templateUrl: './demo2.component.html',
  styleUrls: ['./demo2.component.scss']
})
export class Demo2Component implements OnInit {

  constructor(private router: Router, active: ActivatedRoute) {
    // this.router.events.pipe(
    //   filter((e: Event) => (e instanceof NavigationEnd)),
    // ).subscribe((e: NavigationEnd) => {
    //   console.log('e.url 的值是：', e.url);
    // });
  }


  ngOnInit() {
    console.log('demo2 init');
  }

  ngOnActive() {
    alert('demo2');
  }
}
