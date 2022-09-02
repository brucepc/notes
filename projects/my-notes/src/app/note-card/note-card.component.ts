import {ChangeDetectorRef, Component, HostListener, Input} from '@angular/core';
import {NoteCardStateEnum} from "./note-card-state-enum";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Note, NoteDraft} from "../dtos/notes";
import {NotesService} from "../common/notes.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addOnBlur = true;
  tags: string[] = [];
  noteForm!: FormGroup;

  @Input()
  tabindex: number = 1;

  get state(): NoteCardStateEnum {
    if (this.noteForm.dirty) {
      return NoteCardStateEnum.DRAFT;
    }
    return !this.note ? NoteCardStateEnum.NEW : NoteCardStateEnum.SAVED;
  }

  private _note: Note | null = null;
  @Input()
  set note(value: Note | null) {
    this._note = value;
    if (value) {
      this.noteForm.patchValue({
        title: value.title,
        details: value.details
      });
      this.tags = value.tags || [];
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

  onSave(inputRef: HTMLInputElement) {
    const noteValue: NoteDraft = this.noteForm.value;
    noteValue.tags = [...this.tags];
    if (!this.note && this.noteForm.valid) {
      this.notesService.addNote(noteValue);
      this.cleanCard();
      this.tags = [];
      inputRef.focus();
    } else if (!!this.note && this.noteForm.valid) {
      this.notesService.save(this.note.id, noteValue);
      this.cleanCard();
    }
    this.cdr.detectChanges();
  }

  onDelete() {
    if (!!this.note && this.state !== NoteCardStateEnum.DRAFT) {
      this.notesService.deleteNote(this.note);
    } else {
      this.cleanCard();
    }
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.tags.push(value);
    }

    event.chipInput!.clear();
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      title: [this.note?.title, Validators.required],
      details: [this.note?.details],
      tags: []
    });
  }

  private cleanCard() {
    this.noteForm.reset({
      title: this.note?.title,
      details: this.note?.details
    });
    if (this.note && this.note.tags) {
      this.tags = [...this.note.tags];
    } else {
      this.tags = [];
    }
    this.cdr.detectChanges();
  }
}
