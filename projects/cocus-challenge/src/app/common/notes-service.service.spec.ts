import {TestBed} from '@angular/core/testing';

import {NotesService} from './notes.service';
import {ENCRYPT_KEY} from "./tokens";
import {StorageService} from "./storage.service";
import {v4} from "uuid";

describe('NotesServiceService', () => {
  let service: NotesService;
  let storage: StorageService;
  const note = {id: v4(), title: 'T1', details: 'D'};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: ENCRYPT_KEY, useValue: 'unit-test-key'},
        StorageService
      ]
    });
    storage = TestBed.inject(StorageService);
    service = TestBed.inject(NotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new note to the storage', () => {
    const setItemSpy = spyOn(storage, "setItem");
    service.addNote(note);
    note.title = 'T2';
    service.save(note.id, note);
    expect(service.notes.length).toBe(1);
    expect(setItemSpy).toHaveBeenCalledTimes(2);
  });

  it('should delete a note', () => {
    service.deleteNote(note);
    expect(service.notes.length).toBe(0);
  });
});
