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

    allComments$: Observable<Comment[]>;

    constructor(private _http: Http) {
    }

    ngOnInit() {
    }

    getAllComments(): Observable<Comment[]> {
        return this.allComments$ = this.allComments$ || this._http
            .get(`https://jsonplaceholder.typicode.com/comments`)
            .map((res: Response) => res.json())
            //.shareReplay()
            ;
    }

    getAllPosts(): Observable<Post[]> {
        return this._http.get(`https://jsonplaceholder.typicode.com/posts`)
            .map(res => res.json());
    }

    getPostsWithComments() {
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