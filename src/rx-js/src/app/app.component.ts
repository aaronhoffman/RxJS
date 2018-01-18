import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MousePoint } from './MousePoint';
import { Comment } from './comment';
import { Post } from './post';

// include observable
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// my services
import { MessageService } from './message.service';
import { JsonPlaceholderService } from './jsonPlaceholder.service';

// need to add observable operators in addition to rxjs/Observable above
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/toArray';
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

  // text for initial examples
  textAreaValue: string;

  // text for compose mouse event example
  mouseDownValue: string;
  mouseUpValue: string;
  mouseMoveValue: string;
  mouseDownMoveValue: string;

  // observables for compose mouse event example
  mouseDown$: Observable<MousePoint>;
  mouseUp$: Observable<MousePoint>;
  mouseMove$: Observable<MousePoint>;
  mouseDownMove$: Observable<MousePoint>;

  // text for messaging between components example
  nextMessage: string;

  constructor(
    private _messageService: MessageService,
    private _jsonPlaceholderService: JsonPlaceholderService) {
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

    // note: demo multiple subs
    this.mouseDown$.subscribe(x => console.log(x));

    // compose observable from others
    // breakdown: every time mouseDown happens, create a new observable from mouseMove, takeUntil mouseUp
    this.mouseDownMove$ = this.mouseDown$
      .mergeMap(x => this.mouseMove$.takeUntil(this.mouseUp$));

    // wire up subscriptions
    this.mouseDown$.subscribe(x => this.mouseDownValue = "x: " + x.x + "; y: " + x.y);
    this.mouseUp$.subscribe(x => this.mouseUpValue = "x: " + x.x + "; y: " + x.y);
    this.mouseMove$.subscribe(x => this.mouseMoveValue = "x: " + x.x + "; y: " + x.y);
    this.mouseDownMove$.subscribe(x => this.mouseDownMoveValue = "x: " + x.x + "; y: " + x.y);
  }

  ngOnInit() {
    this.title = 'RxJS';
    this.textAreaValue = "";
    this.wireUpReactiveForm();

    //this.example01();
  }

  // basic
  example01() {
    // create an Observable that emits a sequence of integers spaced by a given time interval
    const obs = Observable.interval(1000);

    obs.subscribe(x => this.textAreaValue += "\r\ninterval: " + x);
  }

  // filter
  example02() {
    var obs = Observable.interval(1000);

    obs
      .filter(x => x % 2 === 0)
      .subscribe(x => this.textAreaValue += "\r\ninterval: " + x);

    // demo composability
    // obs = obs.filter(x => x % 2 === 0);
    // obs.subscribe(x => this.textAreaValue += "\r\ninterval: " + x);
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

  // map, aka: projection
  example04() {
    const obs = Observable.interval(1000);

    obs
      .map(x => "obs: " + x)
      .subscribe(x => this.textAreaValue += "\r\ninterval: " + x);
  }

  // merge
  example05() {
    let obs1 = Observable.interval(1000).map(x => "obs1: " + x);
    let obs5 = Observable.interval(5000).map(x => "obs5: " + x);

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

    // note: result of .subscribe() call is a Subscription object
    //sub.unsubscribe()
  }


  // message between components with observable example
  newMessage(msg: string) {
    this._messageService.sendMessage(msg);
  }


  // service call examples
  serviceResult: string = ""

  onGetCommentsClick() {
    this._jsonPlaceholderService.getAllComments()
      .subscribe(x => this.serviceResult = this.getUnique() + '\r\n\r\n'
        + x.map(x => x.body).join('\r\n\r\n-'));
  }

  onPostsAndCommentsClick() {
    // forkJoin: When all observables complete, emit the last emitted value from each.
    // similar to Promise.all()
    var obs = Observable.forkJoin(
      this._jsonPlaceholderService.getAllPosts(),
      this._jsonPlaceholderService.getAllComments()
      // can have more items...
    ).shareReplay();

    // note: if there are no subscribers, requests will never fire
    // if there are multiple subscribers (and no .shareReplay()), it will fire twice

    // `x` will be [Post[], Comment[]]
    obs.subscribe(x => console.log(x));

    // flatten posts and comments 
    obs.subscribe(x => this.serviceResult = this.getUnique() + '\r\n\r\n'
      + x[0].map(x => x.body).concat(x[1].map(x => x.body)).join('\r\n\r\n'));
  }

  onPostsWithCommentsClick() {
    this._jsonPlaceholderService.getPostsWithComments()
      .subscribe(x => console.log(x));
  }

  getUnique() {
    return (new Date().getMilliseconds()) + '';
  }

  // reactive form examples
  postId = new FormControl();
  reactiveFormResult: string = '';
  wireUpReactiveForm() {
    this.postId.valueChanges
      .debounceTime(3000)
      .concatMap(x => this._jsonPlaceholderService.getPost(x))
      .subscribe(x => this.reactiveFormResult = JSON.stringify(x));
  }
}
