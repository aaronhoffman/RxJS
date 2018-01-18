import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../message.service';
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
    selector: 'display-message',
    templateUrl: './displayMessage.component.html'
})
export class DisplayMessageComponent implements OnInit {

    lastMessage: string;
    lastMessage2: string;
    message$: Observable<string>;

    constructor(private _messageService: MessageService) {
    }

    ngOnInit() {
        // note: gets the observable of the MessageService's BehaviorSubject
        this.message$ = this._messageService.getMessages();

        // subscribe to all
        // note: leave this as is, uncomment scenario below
        this.message$.subscribe(x => this.lastMessage = x);

        // take 10
        // this.message$
        //     .take(10)
        //     .subscribe(x => this.lastMessage2 = x + " " + this.getUnique());

        // filter
        // this.message$
        //     .filter(x => x.startsWith("a"))
        //     .subscribe(x => this.lastMessage2 = x + " " + this.getUnique());

        // debounce 
        // this.message$
        //     .debounceTime(3000)
        //     .subscribe(x => this.lastMessage2 = x + " " + this.getUnique());

        // distinct
        // this.message$
        //     .debounceTime(3000)
        //     .distinct()
        //     .subscribe(x => this.lastMessage2 = x + " " + this.getUnique());

        // distinct until changed
        // this.message$
        //     .debounceTime(3000)
        //     .distinctUntilChanged()
        //     .subscribe(x => this.lastMessage2 = x + " " + this.getUnique());

    }

    getUnique(): string {
        return (new Date().getMilliseconds()) + "";
    }
}
