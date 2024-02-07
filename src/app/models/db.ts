import Dexie, { Table } from "dexie";
import { populate } from "./populate";

export enum Path {
  Thread = "Nić przewodnia",
  Spine = "Kręgosłup",
}

export interface ReadingItem {
  id: string;
  stepId: number;
  path: string;
  passages: string;
}

export interface ReadingStep {
  id: number;
  title: string;
  introduction: string;
}

export interface ReadingProgress {
  readingId: string;
  completed: boolean;
  stepId: number;
}

export interface Verse {
  bookAbbr: string;
  chapter: number;
  verse: number;
  verseStr: string;
  text: string;
}

export class ReadingDB extends Dexie {
  steps!: Table<ReadingStep, string>;
  items!: Table<ReadingItem, string>;
  verses!: Table<Verse, string>;
  progress!: Table<ReadingProgress, number>;

  constructor() {
    super("ReadingDB");
    this.version(3).stores({
      steps: "id",
      items: "id, path, stepId",
      progress: "++id, readingId",
      verses: "[bookAbbr+chapter+verse]",
    });
  }
}

export const db = new ReadingDB();

db.on("populate", populate);

export function resetDatabase() {
  return db.transaction("rw",db.progress, db.items, db.steps, db.verses, async () => {
    await Promise.all([db.progress.clear]);
    await Promise.all([db.verses.clear()]);
    await Promise.all([db.items.clear(), db.steps.clear()]);
    await populate();
  });
}
