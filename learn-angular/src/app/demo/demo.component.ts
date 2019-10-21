import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Event, Router, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  constructor(private router: Router, active: ActivatedRoute) {
    router.events.pipe(
      filter((e: Event) => (e instanceof NavigationStart)),
    ).subscribe((e: NavigationStart) => {
      console.log('e.url 的值是：', e);
      console.log('this 的值是：', this);
      this.ngOnActive();
    });
  }

  ngOnInit() {
  }
  ngOnActive() {
    alert('demo1');
  }
}
