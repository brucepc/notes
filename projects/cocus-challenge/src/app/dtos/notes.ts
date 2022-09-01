export class Note {
  constructor(
    public id: string,
    public title: string,
    public details: string
  ) {
  }
}

export type Notes = Note[];
export type NoteDraft = Omit<Note, 'id'>;
