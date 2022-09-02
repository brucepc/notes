import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {NoteCardComponent} from './note-card/note-card.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ENCRYPT_KEY} from "./common/tokens";
import {NotesService} from "./common/notes.service";
import {StorageService} from "./common/storage.service";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from "@angular/material/badge";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

@NgModule({
  declarations: [
    AppComponent,
    NoteCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatGridListModule,
    MatToolbarModule,
    MatCardModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  providers: [
    {
      provide: ENCRYPT_KEY,
      useValue: 'my-notes-custom-key'
    },
    StorageService,
    NotesService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
