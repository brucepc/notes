import {ChangeDetectorRef, Component, HostListener, Input} from '@angular/core';
import {NoteCardStateEnum} from "./note-card-state-enum";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Note, NoteDraft} from "../notes";
import {NotesService} from "../notes.service";

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent {
  state: NoteCardStateEnum = NoteCardStateEnum.NEW;
  noteForm!: FormGroup;

  @Input()
  tabindex: number = 1;

  private _note: Note | null = null;
  @Input()
  set note(value: Note | null) {
    this._note = value;
    if (value) {
      this.state = NoteCardStateEnum.SAVED;
      this.noteForm.patchValue({
        title: value.title,
        details: value.details
      });
      this.state = NoteCardStateEnum.SAVED;
    }
    this.cdr.detectChanges();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onPressEsc() {
    this.cleanCard();
  }

  get note(): Note | null {
    return this._note;
  }

  get isDraft(): boolean {
    return this.state === NoteCardStateEnum.DRAFT;
  }

  get isNew(): boolean {
    return this.state === NoteCardStateEnum.NEW && !!this.note;
  }

  get isSaved(): boolean {
    return this.state === NoteCardStateEnum.SAVED;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly notesService: NotesService
  ) {
    this.noteForm = this.buildForm();
  }

  onFocusIn() {
    this.state = NoteCardStateEnum.DRAFT;
  }

  onFocusOut() {
    if (!!this.note) {
      this.state = NoteCardStateEnum.SAVED;
    } else if (!this.noteForm.touched) {
      this.state = NoteCardStateEnum.NEW;
    }
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      title: [this.note?.title, Validators.required],
      details: [this.note?.details]
    });
  }

  onSave(inputRef: HTMLInputElement) {
    const noteValue: NoteDraft = this.noteForm.value;
    if (!this.note && this.noteForm.valid) {
      this.notesService.addNote(noteValue);
      inputRef.focus();
      this.cleanCard();
    } else if (!!this.note && this.noteForm.valid) {
      this.notesService.save(this.note.id, noteValue);
      this.cleanCard();
    }
    this.cdr.detectChanges();
  }

  isEmpty(): boolean {
    const noteValue: NoteDraft = this.noteForm.value;
    return noteValue.title !== '' && noteValue.details !== '';
  }

  onDelete() {
    if (!!this.note) {
      this.notesService.deleteNote(this.note);
    } else {
      this.cleanCard();
    }
  }

  private cleanCard() {
    if (!!this.note) {
      this.noteForm.patchValue({title: this.note.title, details: this.note.details});
      this.state = NoteCardStateEnum.SAVED;
    } else {
      this.noteForm.patchValue({title: '', details: ''});
      this.state = NoteCardStateEnum.NEW;
    }
    this.cdr.detectChanges();
  }
}
