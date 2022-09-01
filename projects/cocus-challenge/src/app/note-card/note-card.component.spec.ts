import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NoteCardComponent} from './note-card.component';
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {By} from "@angular/platform-browser";
import {ENCRYPT_KEY} from "../common/tokens";
import {StorageService} from "../common/storage.service";
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatButtonHarness} from "@angular/material/button/testing";
import {NotesService} from "../common/notes.service";
import {v4} from "uuid";

describe('NoteCardComponent', () => {
  let component: NoteCardComponent;
  let fixture: ComponentFixture<NoteCardComponent>;
  let notesService: NotesService;
  let storage: StorageService;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoteCardComponent],
      providers: [
        {provide: ENCRYPT_KEY, useValue: 'unit-test-key'},
        StorageService,
        NotesService
      ],
      imports: [MatCardModule, FormsModule, ReactiveFormsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NoteCardComponent);
    component = fixture.componentInstance;
    notesService = TestBed.inject(NotesService);
    storage = TestBed.inject(StorageService);

    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a card with state "new"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.mat-card.new')).toBeTruthy();
  });

  it('should card have 52px of height', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect((compiled.querySelector('.mat-card.new') as HTMLElement)?.offsetHeight).toBe(52);
  });

  it('should expand card when input get focused', () => {
    const debugElement = fixture.debugElement;
    const inputEL = debugElement.query(By.css('input[formcontrolname=title]'));
    const compiled = inputEL.nativeElement;

    compiled.dispatchEvent(new FocusEvent('focusin'));
    fixture.detectChanges();
    expect((debugElement.query(By.css('.mat-card.draft')).nativeElement)?.offsetHeight).toBe(232);
  });

  it('should create new note', async () => {
    const debugElement = fixture.debugElement;
    const notesSpy = spyOn(notesService, "addNote");
    const title = debugElement.query(By.css('input[formcontrolname=title]')).nativeElement;

    title.dispatchEvent(new FocusEvent('focusin'));
    fixture.detectChanges();
    component.noteForm.patchValue({
      title: 'New Title',
      details: 'Details'
    });
    fixture.detectChanges();
    expect(component.noteForm.valid).toBeTrue();

    const saveButton = await loader.getHarness(MatButtonHarness.with({text: 'SAVE'}));
    await saveButton.click();
    expect(notesSpy).toHaveBeenCalled();
  });


  it('should update note', async () => {
    const storageSpy = spyOn(storage, "setItem");
    const debugElement = fixture.debugElement;
    const note = {id: v4(), title: 'Title', details: 'Details'};
    const titleEl = debugElement.query(By.css('input[formcontrolname=title]')).nativeElement;
    const titleChanged = 'Title Changed';

    notesService.notes = [note];
    component.note = note;
    fixture.detectChanges();
    expect(component.isSaved).toBe(true);

    titleEl.dispatchEvent(new FocusEvent('focusin'));
    titleEl.value = titleChanged;
    titleEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.noteForm.valid).toBeTrue();

    const buttonSave = await loader.getHarness(MatButtonHarness.with({text: 'SAVE'}));
    await buttonSave.click();
    expect(storageSpy).toHaveBeenCalled();
    expect(notesService.notes[0].title).toBe(titleChanged);
  });
});
