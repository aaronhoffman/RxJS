import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MousePoint } from './MousePoint';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/bufferTime';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/buffer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('mouseDiv') mouseDiv: ElementRef;

  title: string;
  textAreaValue: string;

  mouseDownValue: string;
  mouseUpValue: string;
  mouseMoveValue: string;
  mouseDownMoveValue: string;

  mouseDown$: Observable<MousePoint>;
  mouseUp$: Observable<MousePoint>;
  mouseMove$: Observable<MousePoint>;
  mouseDownMove$: Observable<MousePoint>;

  constructor() {
  }

  ngAfterViewInit() {
    // define observables
    this.mouseDown$ = Observable
      .fromEvent(this.mouseDiv.nativeElement, 'mousedown')
      .map((e: MouseEvent) => <MousePoint>{ x: e.offsetX, y: e.offsetY });

    this.mouseUp$ = Observable
      .fromEvent(this.mouseDiv.nativeElement, 'mouseup')
      .map((e: MouseEvent) => <MousePoint>{ x: e.offsetX, y: e.offsetY });

    this.mouseMove$ = Observable
      .fromEvent(this.mouseDiv.nativeElement, 'mousemove')
      .map((e: MouseEvent) => <MousePoint>{ x: e.offsetX, y: e.offsetY });

    // compose observable from others
    this.mouseDownMove$ = this.mouseDown$.mergeMap(x => this.mouseMove$.takeUntil(this.mouseUp$));

    // wire up subscriptions
    this.mouseDown$.subscribe(x => this.mouseDownValue = "x: " + x.x + "; y: " + x.y);
    this.mouseUp$.subscribe(x => this.mouseUpValue = "x: " + x.x + "; y: " + x.y);
    this.mouseMove$.subscribe(x => this.mouseMoveValue = "x: " + x.x + "; y: " + x.y);
    this.mouseDownMove$.subscribe(x => this.mouseDownMoveValue = "x: " + x.x + "; y: " + x.y);
  }

  ngOnInit() {
    this.title = 'RxJS';
    this.textAreaValue = "";

    this.example01();
  }

  // basic
  example01() {
    const obs = Observable.interval(1000);

    obs.subscribe(x => this.textAreaValue += "\r\ninterval: " + x);
  }

  // filter
  example02() {
    const obs = Observable.interval(1000);

    obs
      .filter(x => x % 2 === 0)
      .subscribe(x => this.textAreaValue += "\r\ninterval: " + x);
  }

  // take
  example03() {
    const obs = Observable.interval(1000);

    obs
      .take(10)
      .subscribe(
      x => this.textAreaValue += "\r\ninterval: " + x,
      err => this.textAreaValue = "error: " + err,
      () => this.textAreaValue += "\r\ncomplete");
  }

  // map, projection
  example04() {
    const obs = Observable.interval(1000);

    obs
      .map(x => "obs: " + x)
      .subscribe(x => this.textAreaValue = "\r\ninterval: " + x);
  }

  // merge, join
  example05() {
    let obs1 = Observable.interval(1000).map(x => "obs1: " + 1 * (x + 1));
    let obs5 = Observable.interval(5000).map(x => "obs5: " + 5 * (x + 1));

    obs1
      .merge(obs5)
      .subscribe(x => this.textAreaValue += "\r\ninterval: " + x);
  }

  // buffer
  example06() {
    let obs1 = Observable.interval(500);

    let sub = obs1
      .bufferTime(3000)
      .subscribe(x => this.textAreaValue += "\r\nbuffer: " + x);

    console.log(sub);
  }
}
