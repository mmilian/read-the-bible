import { ITEMS, STEPS, VERSES } from "./data";
import { db } from "./db";

export async function populate() {
  await db.steps.bulkAdd(STEPS);
  await db.items.bulkAdd(ITEMS);
  await db.verses.bulkAdd(VERSES);
}
