import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Notes} from "./dtos/notes";
import {NotesService} from "./common/notes.service";
import {FormControl} from "@angular/forms";
import {debounceTime, distinctUntilChanged} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  searchInputControl = new FormControl();
  notes: Notes = [];

  constructor(
    private readonly notesService: NotesService,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.searchInputControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(value => this.onFilterChange(value));
    this.notes = this.notesService.notes;
  }

  onFilterChange(term: any) {
    if (term != '') {
      this.notes = this.notesService.filterNotesByTerm(term);
    } else {
      this.notes = this.notesService.notes;
    }
    this.cdr.detectChanges();
  }
}
