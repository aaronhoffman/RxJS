import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { MessageService } from './message.service';
import { JsonPlaceholderService } from './jsonPlaceholder.service';
import { DisplayMessageComponent } from './displayMessage/displayMessage.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  declarations: [
    AppComponent,
    DisplayMessageComponent
  ],
  providers: [
    MessageService,
    JsonPlaceholderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
