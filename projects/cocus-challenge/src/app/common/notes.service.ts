import {Injectable} from '@angular/core';
import {Note, NoteDraft, Notes} from "../dtos/notes";
import {v4 as uuidv4} from "uuid";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  notes: Notes = [];

  constructor(
    private readonly storage: StorageService
  ) {
    this.notes = this.storage.getItem('notes') || [];
  }

  addNote(draft: NoteDraft) {
    const note: Note = {
      ...draft,
      id: uuidv4()
    }
    this.notes.push(note);
    this.updateStorage();
  }

  deleteNote(note: Note) {
    const found = this.notes.findIndex(n => n.id === note.id);
    if (found === 0) {
      this.notes.shift();
    } else if (found > 0) {
      this.notes.splice(found, 1);
    }
    this.updateStorage();
  }

  save(id: string, note: NoteDraft) {
    const noteFound = this.notes.find(n => n.id === id);
    if (noteFound) {
      noteFound.title = note.title;
      noteFound.details = note.details;
    }
    this.updateStorage();
  }

  private updateStorage() {
    this.storage.setItem('notes', this.notes);
  }
}
