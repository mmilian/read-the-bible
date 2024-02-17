"use client";
import { useLiveQuery } from "dexie-react-hooks";
import {
  db,
  Path,
  ReadingProgress,
  ReadingStep,
  resetDatabase,
} from "./models/db";
import { PropsWithChildren, Suspense, useEffect, useState } from "react";
import { FiBookOpen } from "react-icons/fi";
import Link from "next/link";
import { groupBy } from "./funcUtils";
import HamburgerMenu from "./components/menu";
import useLocalStorage from "./hooks/local";
import { AppState } from "./models/appState";
import { useRouter } from "next/navigation";

type ItemView = {
  readingId: string;
  completed: boolean;
  stepId: number;
  path: string;
  passages: string;
};

type StepView = {
  id: number;
  title: string;
  introduction: string;
  items: ReadingProgress[];
};

function scrolTo(elementId: string) {
  const element = document.getElementById(`step-${elementId}`);
  // TODO: This is a hack. Should be replace by useLayoutEffect
  setTimeout(() => {
    console.log("Scrolling to ", elementId, "element ", element);
    element?.scrollIntoView({
      behavior: "instant",
      block: "center",
      inline: "center",
    });
  }, 100);
}

function buildReadingView(
  stepList: ReadingStep[],
  progressList: ReadingProgress[]
) {
  const idexedSteps = groupBy(stepList, "id");
  const idexedProgres = groupBy(progressList, "stepId");
  console.log("IndexedProgres", idexedProgres);
  const stepsView: StepView[] = [];
  for (const stepId in idexedProgres) {
    let readingsInStep = idexedProgres[stepId];
    let readingItems: ReadingProgress[] = [];
    for (const reading of readingsInStep) {
      readingItems.push({
        ...reading,
      });
    }
    stepsView.push({
      items: readingItems,
      id: stepId as unknown as number,
      title: idexedSteps[stepId][0].title,
      introduction: idexedSteps[stepId][0].introduction,
    });
  }
  return stepsView;
}

function ResetDatabaseButton() {
  return (
    <button
      onClick={() => {
        resetDatabase();
      }}
      className="btn"
      data-color-scheme="primary"
    >
      Reset All
    </button>
  );
}

function ReadingItemView({
  item,
}: PropsWithChildren<{ item: ReadingProgress }>) {
  return (
    <div className={"readingItem " + (item.completed ? "done" : "")}>
      <div className="readingItemCheck">
        <input
          id={String(item.id)}
          type="checkbox"
          checked={!!item.completed}
          onChange={(ev) => {
            window.location.hash = String(item.stepId);
            db.progress.update(
              { ...item },
              {
                completed: ev.target.checked,
              }
            );
          }}
          className="form-control"
        />
        <label htmlFor={String(item.id)}>{item.passages}</label>
      </div>

      <Link
        href={`/pages/reading/${item.passages}/${item.stepId}`}
        className="btn mr-100"
        data-color-scheme="primary"
        data-variant="circle"
        prefetch={true}
      >
        <FiBookOpen size={23} />
        <span className="visuallyHidden">przeczytaj fragment</span>
      </Link>
    </div>
  );
}

function ReadingStep({
  step,
  path,
  maxProgres,
}: PropsWithChildren<{ step: StepView; path: string; maxProgres: string }>) {
  useEffect(() => {
    if (maxProgres !== undefined && maxProgres == String(step.id)) {
      console.log("If MaxProgres ", maxProgres);
      scrolTo(String(maxProgres));
    }
  }, [maxProgres, step]); //

  return (
    <div id={`step-${step.id}`} className="card">
      <h2 className="mt-300">{step.title}</h2>
      <p className="mt-100">{step.introduction}</p>
      <div className="readingList">
        {step.items
          .filter((el) => el.path === path)
          .map((item) => (
            <ReadingItemView key={item.id} item={item} />
          ))}
      </div>
    </div>
  );
}

function ReadingSteps({
  appState,
  setAppState,
}: PropsWithChildren<{
  appState: AppState;
  setAppState: (appState: AppState) => void;
}>) {
  const readingProgress = useLiveQuery(() =>
    db.progress.orderBy("id").toArray()
  );
  const [selectedPath, setSelectedPath] = useState<string>(
    appState?.selectedPath
  );
  const stepList = useLiveQuery(() => db.steps.toArray());

  if (!readingProgress || readingProgress.length == 0) return null;
  if (!stepList || stepList.length == 0) return null;

  const maxProgress = readingProgress.reduce((prev, current) => {
    if (current.completed) {
      if (prev.stepId > current.stepId) {
        return prev;
      } else {
        console.log("MaxProgress", current);
        return current;
      }
    }
    return prev;
  });
  console.log("MaxProgress is ", maxProgress);
  const hashStepId = window.location.hash.substring(1);
  const readingView = buildReadingView(stepList, readingProgress);

  const handlePathChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAppState;
    setSelectedPath(event.target.value as Path);
  };

  return (
    <>
      <header className="header">
        <h1 className="logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="25"
            viewBox="0 0 28 25"
          >
            <path
              className="logoSignature"
              d="M5.348 0c2.757 0 5.327.791 7.488 2.155V7.86H8.464a1.008 1.008 0 0 0 0 2.015h4.372V24.79a11.82 11.82 0 0 0-7.488-2.65c-1.377 0-2.696.232-3.922.659-.327.114-.69.064-.974-.133A1.05 1.05 0 0 1 0 21.803V1.774C0 1.327.286.929.713.78A14.069 14.069 0 0 1 5.348 0Zm9.627 9.875V24.79a11.82 11.82 0 0 1 7.488-2.65c1.377 0 2.697.232 3.923.659.327.114.69.064.974-.133a1.05 1.05 0 0 0 .452-.861V1.774c0-.447-.286-.845-.713-.994A14.069 14.069 0 0 0 22.463 0c-2.756 0-5.326.791-7.488 2.155V7.86h4.17a1.008 1.008 0 0 1 0 2.015h-4.17Z"
            />
          </svg>
        </h1>
        <div className="headerControls">
          <select
            value={selectedPath}
            onChange={handlePathChange}
            className="form-select"
            aria-label="wybierz poziom"
          >
            <option value={Path.Thread}>{Path.Thread}</option>
            <option value={Path.Spine}>{Path.Spine}</option>
          </select>
          <HamburgerMenu />
        </div>
      </header>
      <main className="main">
        {readingView.map((step) => (
          <ReadingStep
            key={step.id}
            step={step}
            path={selectedPath}
            maxProgres={hashStepId ? hashStepId : String(maxProgress.stepId)}
          />
        ))}
      </main>
      <div className="footer">
        <div id="resetButton" className="card">
          <ResetDatabaseButton />
        </div>
      </div>
    </>
  );
}

export default function Home() {
  const [appState, setAppState] = useLocalStorage("appState", {
    selectedPath: Path.Thread.toString(),
    intro: true,
  });
  const router = useRouter();
  useEffect(() => {
    if (appState.intro) {
      setAppState({ ...appState, intro: false });
      router.push("/pages/intro");
    }
  });
  return (
    <div className="app">
      <Suspense fallback={<h2>Loading...</h2>}>
        <ReadingSteps appState={appState} setAppState={setAppState} />
      </Suspense>
    </div>
  );
}
