import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Comment} from './comment';

@Injectable()
export class jsonPlaceholderService implements OnInit {

    //private commentsSubject: BehaviorSubject<Comment> = new BehaviorSubject(null);

    constructor() {
    }

    ngOnInit() {
    }

}