"use client";
import { useLiveQuery } from "dexie-react-hooks";
import { db, Path, ReadingItem, ReadingProgress, ReadingStep, resetDatabase } from "./models/db";
import { PropsWithChildren, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpenReader } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { groupBy } from "./funcUtils";
import HamburgerMenu from "./components/menu";
import useLocalStorage from "./hooks/local";
import { AppState } from "./models/appState";
import { useRouter } from "next/navigation";


type ItemView = {
  readingId: string,
  completed: boolean,
  stepId: number,
  path: string,
  passages: string,
}

type StepView = {
  id: number,
  title: string,
  introduction: string,
  items: ItemView[],
}


function scrolTo(elementId: string) {
  const element = document.getElementById(`step-${elementId}`);
  // TODO: This is a hack. Should be replace by useLayoutEffect
  setTimeout(() => {
    console.log("Scrolling to ", elementId, "element ", element);
    element?.scrollIntoView(
      {
        behavior: "instant",
        block: "center",
        inline: "center"
      }
    )
  }, 100);
}


function buildReadingView(stepList: ReadingStep[], itemList: ReadingItem[], progressList: ReadingProgress[]) {
  const idexedSteps = groupBy(stepList, "id");
  const indexedItems = groupBy(itemList, "id");
  const idexedProgres = groupBy(progressList, "stepId");
  console.log("IndexedProgres", idexedProgres)
  const stepsView: StepView[] = [];
  for (const stepId in idexedProgres) {
    let readingsInStep = idexedProgres[stepId];
    let readingItems: ItemView[] = [];
    for (const reading of readingsInStep) {
      readingItems.push({
        ...reading,
        passages: indexedItems[reading.readingId][0].passages,
        path: indexedItems[reading.readingId][0].path,
      });
    }
    stepsView.push({ items: readingItems, id: stepId as unknown as number, title: idexedSteps[stepId][0].title, introduction: idexedSteps[stepId][0].introduction });
  }
  return stepsView;
}


function ResetDatabaseButton() {
  return (
    <button
      className="btn"
      onClick={() => {
        resetDatabase();
      }}
    >
      Reset All
    </button>
  );
}

function ReadingItemView({ item }: PropsWithChildren<{ item: ItemView }>) {

  return (
    <div className={"readingItem " + (item.completed ? "done" : "")}>
      <div className="readingItemCheck">
        <input
          id={item.readingId}
          type="checkbox"
          checked={!!item.completed}
          onChange={(ev) => {
            window.location.hash = String(item.stepId);
            db.progress.update({ ...item }, {
              completed: ev.target.checked,
            })
          }
          }
          className="form-control"
        />
        <label htmlFor={item.readingId}>{item.passages}</label>
      </div>

      <Link href={`/pages/reading/${item.passages}/${item.stepId}`} className="readingItemLink" prefetch={true}>
        <FontAwesomeIcon icon={faBookOpenReader} size="sm" />
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
    if ((maxProgres !== undefined) && (maxProgres == String(step.id))) {
      console.log("If MaxProgres ", maxProgres)
      scrolTo(String(maxProgres));
    }
  }, [maxProgres, step]); //

  return (
    <div id={`step-${step.id}`} className="card">
      <h2 className="readingTitle">{step.title}</h2>
      <p className="readingDescription">{step.introduction}</p>
      <div className="readingList">
        {step.items
          .filter((el) => el.path === path)
          .map((item) => (
            <ReadingItemView key={item.readingId} item={item} />
          ))}
      </div>
    </div>
  );
}



function ReadingSteps({appState, setAppState}: PropsWithChildren<{appState: AppState, setAppState: (appState: AppState) => void}>) {
  const readingProgress = useLiveQuery(() => db.progress.orderBy("id").toArray());
  const [selectedPath, setSelectedPath] = useState<string>(appState?.selectedPath);
  const stepList = useLiveQuery(() => db.steps.toArray());
  const itemList = useLiveQuery(() => db.items.toArray());

  if (!readingProgress || (readingProgress.length == 0)) return null;
  if (!stepList || (stepList.length == 0)) return null;
  if (!itemList || (itemList.length) == 0) return null;

  const maxProgress = readingProgress.reduce((prev, current) => {
    if (current.completed) {
      if (prev.stepId > current.stepId) {
        return prev  
      } else  {
        console.log("MaxProgress", current)
        return  current;
      }
    }
    return prev
  });
  const hashStepId = window.location.hash.substring(1);
  const readingView = buildReadingView(stepList, itemList, readingProgress);
  
  
  const handlePathChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAppState
    setSelectedPath(event.target.value as Path);
  };

  return (
    <>
      <header className="header">
      <h1 className="logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="70"
            height="25"
            fill="none"
          >
            <path
              className="logoSignature"
              d="M5.348 0c2.757 0 5.327.791 7.488 2.155V7.86H8.464a1.008 1.008 0 0 0 0 2.015h4.372V24.79a11.82 11.82 0 0 0-7.488-2.65c-1.377 0-2.696.232-3.922.659-.327.114-.69.064-.974-.133A1.05 1.05 0 0 1 0 21.803V1.774C0 1.327.286.929.713.78A14.069 14.069 0 0 1 5.348 0Zm9.627 9.875V24.79a11.82 11.82 0 0 1 7.488-2.65c1.377 0 2.697.232 3.923.659.327.114.69.064.974-.133a1.05 1.05 0 0 0 .452-.861V1.774c0-.447-.286-.845-.713-.994A14.069 14.069 0 0 0 22.463 0c-2.756 0-5.326.791-7.488 2.155V7.86h4.17a1.008 1.008 0 0 1 0 2.015h-4.17Z"
            />
            {/* <path
              className="logoName"
              d="M139.389 21.574a5.005 5.005 0 0 1-1.593-.25 2.768 2.768 0 0 1-1.27-.846c-.349-.415-.623-1.004-.822-1.768-.182-.764-.274-1.751-.274-2.963 0-1.56.125-2.814.374-3.76.249-.946.581-1.66.996-2.141.415-.482.888-.805 1.419-.971a5.398 5.398 0 0 1 1.619-.25c1.045 0 1.834.333 2.365.997.531.664.797 1.668.797 3.012 0 .548-.025 1.113-.075 1.694a8.007 8.007 0 0 1-.224 1.543c-.564.117-1.195.2-1.892.25-.697.05-1.361.09-1.992.124-.631.017-1.154.025-1.569.025h-.598l.025-1.643.473.024h1.146c.465-.016.929-.041 1.394-.074.482-.05.888-.125 1.22-.224.05-.233.083-.482.1-.747.017-.266.025-.515.025-.747-.017-.897-.125-1.528-.324-1.893-.182-.382-.548-.572-1.095-.572-.283 0-.557.082-.822.248-.249.15-.473.424-.672.822-.2.382-.357.913-.474 1.594-.099.68-.149 1.552-.149 2.614 0 .78.042 1.428.125 1.942.099.515.24.913.423 1.196.199.282.44.49.722.622.299.116.656.175 1.071.175.498 0 .987-.067 1.469-.2a4.894 4.894 0 0 0 1.344-.572c.083.199.133.431.15.697.033.249.05.473.05.672 0 .25-.158.482-.474.697-.315.216-.738.382-1.269.498a7.825 7.825 0 0 1-1.719.175ZM131.525 21.325V3.945c0-.316.049-.532.149-.648.116-.133.324-.208.623-.224.298-.033.713-.05 1.245-.05v17.903c0 .133-.034.224-.1.274-.05.05-.216.083-.498.1-.266.016-.739.025-1.419.025ZM124.882 21.574c-.664 0-1.245-.067-1.743-.2-.481-.132-.871-.315-1.17-.547V3.969c0-.315.05-.54.149-.672.117-.133.316-.208.598-.224.299-.033.722-.05 1.27-.05v6.474c.349-.266.73-.473 1.145-.622.432-.166.938-.25 1.519-.25.664 0 1.22.158 1.669.474.448.315.788.83 1.02 1.543.233.714.349 1.677.349 2.889 0 1.428-.1 2.631-.299 3.61-.182.98-.448 1.76-.797 2.341-.332.581-.705 1.03-1.12 1.345a3.516 3.516 0 0 1-1.295.597c-.448.1-.88.15-1.295.15Zm.274-1.793c.216 0 .457-.067.722-.2.266-.132.515-.398.747-.796.233-.399.424-.98.573-1.743.166-.78.249-1.801.249-3.063 0-.896-.066-1.602-.199-2.116-.133-.515-.324-.88-.573-1.096-.232-.216-.548-.324-.946-.324-.315 0-.623.058-.921.175a2.36 2.36 0 0 0-.822.522v8.317c.116.083.266.158.448.224.183.067.423.1.722.1ZM117.591 21.325V9.795c0-.315.059-.53.175-.647.116-.132.323-.207.622-.224.299-.033.722-.05 1.27-.05v12.052c0 .133-.033.224-.099.274-.05.05-.216.083-.498.1-.283.016-.772.024-1.47.024Zm.972-14.169c-.316-.016-.565-.132-.747-.348-.183-.233-.274-.64-.274-1.22.016-.449.116-.805.298-1.071.183-.282.474-.423.872-.423.382 0 .647.108.797.323.149.216.216.59.199 1.12 0 .499-.1.897-.299 1.196-.182.282-.465.423-.846.423ZM108.155 21.325V4.368c0-.15.041-.266.124-.349.1-.083.283-.124.548-.124h2.465c.498 0 .996.058 1.494.174.498.1.946.29 1.345.573.398.265.722.647.971 1.145s.373 1.154.373 1.967c0 .913-.124 1.652-.373 2.216-.249.565-.556.996-.921 1.295-.366.282-.731.448-1.096.498.282.017.589.083.921.2.349.099.673.281.971.547.316.249.565.606.747 1.07.2.466.299 1.071.299 1.818 0 .83-.083 1.57-.249 2.216-.149.648-.373 1.204-.672 1.669a4.365 4.365 0 0 1-1.021 1.17c-.398.299-.83.523-1.295.672-.465.133-.963.2-1.494.2h-3.137Zm2.067-1.768h1.12c.315 0 .606-.075.872-.224.282-.15.531-.382.747-.698.215-.332.381-.747.498-1.245.132-.498.199-1.104.199-1.817 0-.648-.058-1.154-.175-1.52-.099-.381-.257-.663-.473-.846-.199-.199-.44-.324-.722-.373a5.305 5.305 0 0 0-.921-.075h-1.145v6.798Zm0-8.541h1.22c.348 0 .655-.1.921-.299.282-.199.498-.514.647-.946.166-.432.249-.98.249-1.643 0-.681-.091-1.196-.274-1.544-.166-.349-.39-.581-.672-.697a2.079 2.079 0 0 0-.896-.2h-1.195v5.329ZM98.878 21.574a5.007 5.007 0 0 1-1.593-.25 2.772 2.772 0 0 1-1.27-.846c-.349-.415-.623-1.004-.822-1.768-.183-.764-.274-1.751-.274-2.963 0-1.56.125-2.814.374-3.76.249-.946.58-1.66.996-2.141.415-.482.888-.805 1.419-.971a5.397 5.397 0 0 1 1.618-.25c1.046 0 1.835.333 2.366.997.531.664.797 1.668.797 3.012 0 .548-.025 1.113-.075 1.694a8.007 8.007 0 0 1-.224 1.543c-.564.117-1.195.2-1.892.25-.698.05-1.362.09-1.992.124-.631.017-1.154.025-1.57.025h-.597l.025-1.643.473.024h1.146c.465-.016.93-.041 1.394-.074.481-.05.888-.125 1.22-.224.05-.233.083-.482.1-.747.016-.266.025-.515.025-.747-.017-.897-.125-1.528-.324-1.893-.183-.382-.548-.572-1.096-.572a1.53 1.53 0 0 0-.821.248c-.25.15-.473.424-.673.822-.199.382-.357.913-.473 1.594-.1.68-.15 1.552-.15 2.614 0 .78.042 1.428.125 1.942.1.515.241.913.424 1.196.199.282.44.49.722.622.299.116.656.175 1.07.175.499 0 .988-.067 1.47-.2a4.894 4.894 0 0 0 1.344-.572c.083.199.133.431.15.697.033.249.049.473.049.672 0 .25-.157.482-.473.697-.315.216-.738.382-1.27.498a7.807 7.807 0 0 1-1.718.175ZM85.59 21.325V3.945c0-.316.05-.532.15-.648.116-.133.315-.208.597-.224.3-.033.722-.05 1.27-.05v6.574a3.533 3.533 0 0 1 1.32-.722 4.786 4.786 0 0 1 1.469-.25c.714 0 1.253.133 1.619.399.381.249.639.614.772 1.096.132.48.199 1.079.199 1.792v9.014c0 .133-.042.224-.125.274-.066.05-.249.083-.548.1a26.97 26.97 0 0 1-1.394.025V12.46c0-.548-.091-1.013-.274-1.394-.166-.382-.556-.573-1.17-.573-.282 0-.59.05-.922.15-.332.099-.647.282-.946.547v9.736c0 .133-.033.224-.1.274-.05.05-.215.083-.497.1-.283.016-.756.025-1.42.025ZM78.767 21.325V4.193l.05-.025c.033-.033.149-.05.348-.05h1.195c.216 0 .34.017.374.05l.05.025v16.733c0 .133-.034.224-.1.274-.05.05-.216.083-.498.1-.282.016-.755.025-1.42.025ZM75.38 5.787V4.293c0-.266.141-.398.424-.398h8.465v1.494c0 .149-.033.257-.1.323-.066.05-.173.075-.323.075H75.38ZM66.564 21.574a5.784 5.784 0 0 1-1.544-.2c-.481-.116-.913-.373-1.295-.771-.381-.416-.68-1.021-.896-1.818-.2-.814-.299-1.893-.299-3.237 0-1.644.166-2.972.498-3.984.349-1.03.805-1.776 1.37-2.241.58-.465 1.228-.697 1.942-.697.382 0 .722.041 1.02.124.3.083.549.208.748.374v-5.18c0-.315.05-.53.15-.647.115-.133.323-.208.622-.224.299-.033.714-.05 1.245-.05v17.804c-.399.199-.905.373-1.52.522-.597.15-1.277.225-2.041.225Zm.075-1.818c.282 0 .547-.025.797-.075.248-.066.473-.166.672-.299v-8.665a1.013 1.013 0 0 0-.498-.249 2.31 2.31 0 0 0-.648-.075c-.265 0-.53.067-.796.2-.266.132-.507.381-.722.747-.216.348-.382.846-.499 1.494-.116.63-.174 1.46-.174 2.49 0 .946.042 1.71.125 2.29.083.581.207 1.03.373 1.345.166.299.357.506.573.623.232.116.498.174.797.174ZM57.239 21.574c-.465 0-.913-.042-1.345-.125a2.497 2.497 0 0 1-1.12-.473c-.333-.266-.598-.647-.797-1.145-.2-.498-.3-1.179-.3-2.042 0-.863.092-1.56.275-2.092.182-.548.431-.963.747-1.245a2.377 2.377 0 0 1 1.07-.597c.399-.1.806-.15 1.22-.15.266 0 .573.025.922.075.365.05.672.133.921.249v-1.967c0-.399-.066-.697-.2-.897a.93.93 0 0 0-.522-.448c-.216-.1-.49-.15-.822-.15-.647 0-1.27.059-1.867.175-.598.116-1.08.25-1.444.398a1.76 1.76 0 0 1-.224-.597 3.818 3.818 0 0 1-.05-.573c0-.116.016-.24.05-.373a.597.597 0 0 1 .224-.3c.215-.132.664-.273 1.344-.422.68-.166 1.494-.25 2.44-.25 1.08 0 1.86.225 2.341.673.498.448.747 1.237.747 2.365v1.32c0 .946-.008 1.9-.025 2.864 0 .946-.008 1.842-.025 2.689-.016.83-.05 1.56-.1 2.191-.331.2-.788.39-1.369.573-.58.182-1.278.274-2.091.274Zm.199-1.694c.265 0 .523-.041.772-.124.249-.083.423-.183.523-.299.033-.265.05-.63.05-1.096.016-.464.024-.954.024-1.469.017-.514.025-.996.025-1.444a1.95 1.95 0 0 0-.598-.174 3.817 3.817 0 0 0-.572-.05c-.266 0-.515.033-.747.1a1.1 1.1 0 0 0-.573.348c-.166.166-.299.415-.398.747-.1.332-.15.772-.15 1.32 0 .448.034.813.1 1.096.083.282.2.506.349.672.149.15.323.249.522.299.2.05.424.074.673.074ZM48.689 21.574a5.007 5.007 0 0 1-1.594-.25 2.772 2.772 0 0 1-1.27-.846c-.348-.415-.622-1.004-.821-1.768-.183-.764-.274-1.751-.274-2.963 0-1.56.124-2.814.373-3.76.25-.946.581-1.66.996-2.141.415-.482.888-.805 1.42-.971a5.397 5.397 0 0 1 1.618-.25c1.046 0 1.834.333 2.366.997.53.664.797 1.668.797 3.012 0 .548-.025 1.113-.075 1.694A8.007 8.007 0 0 1 52 15.87c-.565.117-1.196.2-1.893.25-.697.05-1.361.09-1.992.124-.63.017-1.154.025-1.569.025h-.597l.025-1.643.473.024h1.145c.465-.016.93-.041 1.395-.074a6.72 6.72 0 0 0 1.22-.224c.05-.233.083-.482.1-.747.016-.266.024-.515.024-.747-.016-.897-.124-1.528-.323-1.893-.183-.382-.548-.572-1.096-.572a1.53 1.53 0 0 0-.822.248c-.249.15-.473.424-.672.822-.2.382-.357.913-.473 1.594-.1.68-.15 1.552-.15 2.614 0 .78.042 1.428.125 1.942.1.515.24.913.423 1.196.2.282.44.49.722.622.3.116.656.175 1.071.175a5.5 5.5 0 0 0 1.47-.2 4.903 4.903 0 0 0 1.344-.572c.083.199.133.431.15.697.032.249.05.473.05.672 0 .25-.159.482-.474.697-.315.216-.739.382-1.27.498a7.815 7.815 0 0 1-1.718.175ZM36.486 14.253c-.249 0-.382-.042-.398-.124a2.46 2.46 0 0 1-.025-.424V4.094c.017-.133.116-.2.299-.2h2.315c1.046 0 1.91.175 2.59.523.68.332 1.179.864 1.494 1.594.332.714.498 1.652.498 2.814 0 1.029-.124 1.892-.373 2.59-.233.68-.565 1.228-.997 1.643a3.908 3.908 0 0 1-1.444.921 5.476 5.476 0 0 1-1.743.274h-2.216Zm-.697 7.072V4.293l.05-.2c.05-.132.174-.198.373-.198h1.195c.2 0 .316.066.35.199l.049.199v16.633c0 .133-.033.224-.1.274-.05.05-.216.083-.498.1-.282.016-.755.025-1.419.025Zm6.623.05c-.149 0-.332-.009-.547-.026-.2 0-.415-.008-.648-.024-.083-1.428-.257-2.623-.523-3.586-.249-.98-.523-1.751-.821-2.316-.283-.58-.532-.996-.747-1.245l-.324-.373-.05-.15c-.033-.1.033-.199.2-.298l1.095-.598c.2 0 .34.075.423.224l.399.448c.265.3.58.772.946 1.42.365.63.705 1.444 1.02 2.44.316.996.515 2.191.598 3.585 0 .183-.05.316-.15.399-.099.066-.39.1-.87.1Zm-4.656-8.99h1.145c.465 0 .847-.116 1.146-.348.315-.25.556-.64.722-1.17.166-.548.249-1.262.249-2.142 0-.63-.058-1.178-.174-1.643-.117-.465-.324-.814-.623-1.046-.282-.25-.672-.374-1.17-.374h-1.295v6.724Z"
            /> */}
          </svg>
        </h1>
        <select
          value={selectedPath}
          onChange={handlePathChange}
          className="form-select"
          aria-label="wybierz poziom"
        >
          <option value={Path.Thread}>{Path.Thread}</option>
          <option value={Path.Spine}>{Path.Spine}</option>
        </select>
        <HamburgerMenu/>
      </header>
      <main className="main">
        {readingView.map((step) => (
          <ReadingStep key={step.id} step={step} path={selectedPath} maxProgres={hashStepId ? hashStepId : String(maxProgress.stepId)} />
        ))}
      </main>
    </>
  );
}


export default function Home() {
  const [appState, setAppState] = useLocalStorage("appState", { selectedPath: Path.Thread.toString(), intro: true });
  const router = useRouter();
  useEffect(() => {
    if (appState.intro) {
      setAppState({ ...appState, intro: false });
      router.push('/pages/intro');
    }
  });
  return (
    <div className="app">
      <ReadingSteps appState={appState} setAppState={setAppState}/>
      <div className="footer">
        <div id="resetButton" className="card">
          <ResetDatabaseButton />
        </div>
      </div>
    </div>
  );
}

