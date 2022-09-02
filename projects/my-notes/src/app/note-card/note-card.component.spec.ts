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
import {MatChipsModule} from "@angular/material/chips";
import {MatInputModule} from "@angular/material/input";
import {MatInputHarness} from "@angular/material/input/testing";
import {MatChipListHarness} from "@angular/material/chips/testing";
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from "@angular/material/badge";
import {MatBadgeHarness} from "@angular/material/badge/testing";
import {NoteDraft} from "../dtos/notes";

describe('NoteCardComponent', () => {
  let component: NoteCardComponent;
  let fixture: ComponentFixture<NoteCardComponent>;
  let notesService: NotesService;
  let storage: StorageService;
  let loader: HarnessLoader;

  beforeAll(() => {
    localStorage.clear();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoteCardComponent],
      providers: [
        {provide: ENCRYPT_KEY, useValue: 'unit-test-key'},
        StorageService,
        NotesService
      ],
      imports: [
        MatCardModule,
        MatChipsModule,
        MatInputModule,
        MatBadgeModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule
      ]
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

  it('should expand card when type some title', () => {
    const debugElement = fixture.debugElement;
    const inputEL = debugElement.query(By.css('input[formcontrolname=title]'));
    const compiled = inputEL.nativeElement;
    compiled.value = 'New Title';
    compiled.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect((debugElement.query(By.css('.mat-card.draft')).nativeElement)?.offsetHeight).toBe(246);
  });

  it('should create new note', async () => {
    const debugElement = fixture.debugElement;
    const notesSpy = spyOn(notesService, "addNote");
    const title = debugElement.query(By.css('input[formcontrolname=title]')).nativeElement;

    title.dispatchEvent(new Event('input'));
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

    titleEl.value = titleChanged;
    titleEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.noteForm.valid).toBeTrue();

    const buttonSave = await loader.getHarness(MatButtonHarness.with({text: 'SAVE'}));
    await buttonSave.click();
    expect(storageSpy).toHaveBeenCalled();
    expect(notesService.notes[0].title).toBe(titleChanged);

    fixture.destroy();
  });

  it('should add a tag on the note', async () => {
    fixture = TestBed.createComponent(NoteCardComponent);
    notesService = TestBed.inject(NotesService);
    const addNoteSpy = spyOn(notesService, 'addNote');
    fixture.detectChanges();

    const titleInput = await loader.getHarness(MatInputHarness.with({placeholder: 'Note title'}));
    expect(titleInput).toBeTruthy();

    const note: Partial<NoteDraft> = {
      title: 'New Value',
      tags: ['Tag 1', 'Tag 2'],
      details: null as unknown as string
    };
    await titleInput.setValue(note.title as string);
    await (await titleInput.host()).dispatchEvent('input');
    const chipList = await loader.getHarness(MatChipListHarness.with());
    expect(chipList).toBeTruthy();

    const chipsInput = await loader.getHarnessOrNull(MatInputHarness.with({placeholder: '@tags'}));
    expect(chipsInput).toBeTruthy();

    await chipsInput?.setValue((note.tags as Array<string>)[0]);
    await chipsInput?.blur();
    const badgeHarness = await loader.getHarnessOrNull(MatBadgeHarness.with());
    expect(await badgeHarness?.isHidden()).toBeTrue();

    await chipsInput?.setValue((note.tags as Array<string>)[1]);
    await chipsInput?.blur();
    expect(await badgeHarness?.isHidden()).toBeFalse();
    expect(await badgeHarness?.getText()).toBe("2");
    expect((await chipList.getChips()).length).toBe(1);

    const saveBtn = await loader.getHarness(MatButtonHarness.with({text: 'SAVE'}));
    await saveBtn.click();
    expect(addNoteSpy).toHaveBeenCalledOnceWith(note as NoteDraft);
  });
});
