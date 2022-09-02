import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {NoteCardComponent} from "./note-card/note-card.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {ENCRYPT_KEY} from "./common/tokens";
import {StorageService} from "./common/storage.service";
import {NotesService} from "./common/notes.service";
import {v4} from "uuid";
import {HarnessLoader} from "@angular/cdk/testing";
import {By} from "@angular/platform-browser";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatChipsModule} from "@angular/material/chips";
import {MatInputModule} from "@angular/material/input";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {TestbedHarnessEnvironment} from "@angular/cdk/testing/testbed";
import {MatCardHarness} from "@angular/material/card/testing";
import {MatInputHarness} from "@angular/material/input/testing";
import {MatBadgeModule} from "@angular/material/badge";

describe('AppComponent', () => {
  let component: AppComponent;
  let notesService: NotesService;
  let storage: StorageService;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatToolbarModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatChipsModule,
        MatBadgeModule,
        MatIconModule,
        MatInputModule,
        FormsModule,
        MatCardModule
      ],
      declarations: [
        AppComponent,
        NoteCardComponent
      ],
      providers: [
        {provide: ENCRYPT_KEY, useValue: 'unit-test-key'},
        StorageService,
        NotesService
      ]
    }).compileComponents();

  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
    fixture.destroy();
  });

  it(`should have as title 'My Notes' and a placeholder to new note`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    expect(compiled.querySelector('.toolbar-title')?.textContent).toContain('My Notes');
    expect(compiled.querySelectorAll('app-note-card .new').length).toBe(1);
    fixture.destroy();
  });

  it('should list two notes', () => {
    storage = TestBed.inject(StorageService);
    spyOn(storage, "getItem").and.returnValue([
      {id: v4(), title: 'T1', details: 'D'},
      {id: v4(), title: 'T2', details: 'D'}
    ]);
    notesService = TestBed.inject(NotesService);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const debugInstance = fixture.debugElement.queryAll(By.css('app-note-card .saved'));
    expect(debugInstance.length).toBe(2);
    fixture.destroy();
  });

  it('should filter notes', fakeAsync(async () => {
    storage = TestBed.inject(StorageService);
    spyOn(storage, "getItem").and.returnValue([
      {id: v4(), title: 'T1', details: 'A', tags: ['tag1']},
      {id: v4(), title: 'T2', details: 'B'},
      {id: v4(), title: 'T2', details: 'd'},
      {id: v4(), title: 'T4', details: 'D'}
    ]);
    notesService = TestBed.inject(NotesService);
    const fixture = TestBed.createComponent(AppComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
    let debugInstance = await loader.getAllHarnesses(MatCardHarness.with({selector: '.saved'}));
    expect(debugInstance.length).toBe(4);

    let searchInput = await loader.getHarness(MatInputHarness.with({placeholder: 'Search...'}));
    await (await searchInput.host()).sendKeys('t2');
    tick(1000);
    debugInstance = await loader.getAllHarnesses(MatCardHarness.with({selector: '.saved'}));
    expect(debugInstance.length).toBe(2);

    searchInput = await loader.getHarness(MatInputHarness.with({placeholder: 'Search...'}));
    await (await searchInput.host()).clear();
    await (await searchInput.host()).sendKeys('tag1');
    tick(1000);
    debugInstance = await loader.getAllHarnesses(MatCardHarness.with({selector: '.saved'}));
    expect(debugInstance.length).toBe(1);
  }));
});
