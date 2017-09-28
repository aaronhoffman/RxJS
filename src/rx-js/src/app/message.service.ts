import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MessageService implements OnInit {

    // BehaviorSubject:
    // Example of a Rx Subject
    // Both Subscribe and Publish
    // Always has a value
    // OnSubscribe, will send current value
    private messageSubject: BehaviorSubject<string> = new BehaviorSubject("");

    constructor() {
    }

    ngOnInit() {
    }

    getMessages() : Observable<string> {
        return this.messageSubject.asObservable();
    }

    sendMessage(msg: string) {
        this.messageSubject.next(msg);
    }
}