import { STEP_ITEMS, STEPS, VERSES } from "./data";
import { db } from "./db";

async function populateProgress() {
  const items = await db.items.orderBy("stepId").toArray();
  const progressList = items.map((item) => {
    return {
      readingId: item.id,
      completed: false,
      stepId: item.stepId,
    };
  });
  db.progress.bulkAdd(progressList);
}

export async function populate() {
  await db.steps.bulkAdd(STEPS);
  await db.items.bulkAdd(STEP_ITEMS);
  await db.verses.bulkAdd(VERSES);
  console.log("Populated database");
  await populateProgress();
}
