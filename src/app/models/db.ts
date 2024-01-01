import Dexie, { Table } from "dexie";
import { populate } from "./populate";

export enum Path {
  Thread = "Nić przewodnia",
  Spine = "Kręgosłup",
}

export interface ReadingItem {
  id: string;
  stepId: string;
  path: string;
  passages: string;
}

export interface ReadingStep {
  id: string;
  title: string;
  introduction: string;
}

export interface ReadingProgress {
  readingId: string;
  completed: boolean;
}

export interface Verse {
  bookAbbr: string;
  chapter: number;
  verse: number;
  text: string;
}

export class ReadingDB extends Dexie {
  steps!: Table<ReadingStep, string>;
  items!: Table<ReadingItem, string>;
  verses!: Table<Verse, string>;
  progress!: Table<ReadingProgress, number>;

  constructor() {
    super("ReadingDB");
    this.version(2).stores({
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
  return db.transaction("rw", db.items, db.steps, db.verses, async () => {
    await Promise.all([db.items.clear(), db.steps.clear()]);
    if (db.verses) {
      await db.verses.clear();
    }
    await populate();
  });
}
