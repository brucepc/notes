import {ComponentFixture, TestBed} from '@angular/core/testing';
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

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let notesService: NotesService;
  let storage: StorageService;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
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

    // storage = TestBed.inject(StorageService);
    // notesService = TestBed.inject(NotesService);
    // fixture = TestBed.createComponent(AppComponent);
    // component = fixture.componentInstance;
    // loader = TestbedHarnessEnvironment.loader(fixture);
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
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const debugInstance = fixture.debugElement.queryAll(By.css('app-note-card .saved'));
    expect(debugInstance.length).toBe(2);
  })
});
