import { STEP_ITEMS, STEPS, VERSES } from "./data";
import { db } from "./db";

export async function populate() {
  await db.steps.bulkAdd(STEPS);
  await db.verses.bulkAdd(VERSES);
  await db.progress.bulkAdd(STEP_ITEMS);
  console.log("Populated database");
}
