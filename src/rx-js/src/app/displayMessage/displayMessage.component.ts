import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../message.service';

@Component({
  selector: 'display-message',
  templateUrl: './displayMessage.component.html'
})
export class DisplayMessageComponent implements OnInit {
  
  lastMessage: string;
  message$: Observable<string>;

  constructor(private _messageService: MessageService) {
  }

  ngOnInit() {
    this.message$ = this._messageService.getMessages();

    this.message$.subscribe(x => this.lastMessage = x);
  }
}
