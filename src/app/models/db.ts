import Dexie, { Table } from "dexie";
import { populate } from "./populate";

export enum Path {
  Thread = "Nić przewodnia",
  Spine = "Kręgosłup",
}

// export interface ReadingItem {
//   id: string;
//   stepId: number;
//   path: string;
//   passages: string;
// }

export interface ReadingStep {
  id: number;
  title: string;
  introduction: string;
}

export interface ReadingProgress {
  id: number;
  stepId: number;
  path: string;
  completed: boolean;
  passages: string;
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
  verses!: Table<Verse, string>;
  progress!: Table<ReadingProgress, number>;

  constructor() {
    super("ReadingDB");
    this.version(3).stores({
      steps: "id",
      progress: "++id, readingId",
      verses: "[bookAbbr+chapter+verse]",
    });
  }
}

export const db = new ReadingDB();

db.on("populate", populate);

export async function resetDatabase() {
  db.delete()
    .then(() => {
      console.log("Database successfully deleted");
    })
    .catch((err) => {
      console.error("Could not delete database: ", err);
    })
    .finally(() => {
      window.location.reload();
    });
}
