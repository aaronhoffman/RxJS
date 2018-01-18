import { Injectable, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Comment } from './comment';
import { Post } from './post';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/take';


@Injectable()
export class JsonPlaceholderService implements OnInit {

    // property to cache observable if previously called
    allComments$: Observable<Comment[]>;

    constructor(private _http: Http) {
    }

    ngOnInit() {
    }

    getAllComments(): Observable<Comment[]> {
        // Note: Angular Http.get() returns an Observable
        // this will return allComments$ if already created, or define the observable
        // .shareReplay() will ensure the http.get happens only once
        return this.allComments$ = this.allComments$ || this._http
            .get(`https://jsonplaceholder.typicode.com/comments`)
            .map((res: Response) => res.json())
            .shareReplay();
    }

    getAllPosts(): Observable<Post[]> {
        // note: no caching on this call
        return this._http.get(`https://jsonplaceholder.typicode.com/posts`)
            .map(res => res.json());
    }

    getPostsWithComments() {
        // note: example of chained call
        // start with call to /posts, it will return an observable with a single event
        // we will pull the top 4 posts from within that result, create an observable from that
        // and concat that observable onto the end of the initial http.get() call
        // we'll then use mergeMap() to fire off 4 more api calls, one for each post,
        // and merge all the results together into a single observable
        // the final result will be an Observable containing 4 elements
        // each element will be an array of Comments
        return this._http.get(`https://jsonplaceholder.typicode.com/posts`)
            .concatMap(res => Observable.from(res.json()).take(4))
            .mergeMap((x: Post) => this._http.get(`https://jsonplaceholder.typicode.com/posts/${x.id}/comments`))
            .map(res => res.json());
    }

    getPost(id: number): Observable<Post> {
        return this._http.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
            .map(res => res.json());
    }

}