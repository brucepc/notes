import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Notes} from "./dtos/notes";
import {NotesService} from "./common/notes.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  get notes(): Notes {
    return this.notesService.notes;
  }

  constructor(
    private readonly notesService: NotesService
  ) {
  }
}
