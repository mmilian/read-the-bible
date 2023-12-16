"use client"
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Path, ReadingItem, ReadingStep, resetDatabase } from './models/db';
import { PropsWithChildren, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function ResetDatabaseButton() {
  return (
    <button
      className="large-button"
      onClick={() => {
        resetDatabase();
      }}
    >
      <FontAwesomeIcon icon={["fas", "house-laptop"]} /> Reset Database
    </button>
  );
}

function ReadingItemView({ item }: PropsWithChildren<{ item: ReadingItem }>) {

  const progressList = useLiveQuery(
    () => db.progress.where({ readingId: item.id }).toArray(),
    [item.id]
  );
  if (!progressList) return null;
  if (progressList.length === 0) {
    let progress = {
      readingId: item.id, completed: false,
    }
    db.progress.add(progress);
    progressList.push(progress);
  }
  const progress = progressList[0];
  return (
    <div className={'row ' + (progress.completed ? 'done' : '')}>
      <div className="narrow">
        <input
          type="checkbox"
          checked={!!progress.completed}
          onChange={ev =>
            db.progress.update(progress, {
              completed: ev.target.checked
            })
          }
        />
      </div>
      <div className="todo-item-text">{item.passages}</div>
    </div>
  );
}


function StepView({ step, path }: PropsWithChildren<{ step: ReadingStep, path: Array<string> }>) {
  const items = useLiveQuery(
    () => db.items.where({ stepId: step.id}).toArray(),
    [step.id]
  );

  if (!items) return null;

  return (
    <div className="box">
      <div className="grid-row">
        <h2>{step.title}</h2>
      </div>
      <div className="grid-row">
        <p>{step.introduction}</p>
      </div>

      <div>
        <h3> {path[0]  === Path.Thread ? Path.Thread : ""}</h3>
        {items.filter(el => el.path === path[0]).map(item => (
          <ReadingItemView key={item.id} item={item} />
        ))}
        <div>
        <h3> {path[1]  === Path.Spine ? Path.Spine : ""}</h3>
        {items.filter(el => el.path === path[1]).map(item => (
          <ReadingItemView key={item.id} item={item} />
        ))}
      </div>
      </div>
    </div>
  );
}


function Steps() {

  const [path, setPath] = useState({ thread: true, spine: false });
  const handlePathChange1 = () => {
    setPath({ thread: !path.thread, spine: path.spine })
  };
  const handlePathChange2 = () => {
    setPath({ thread: path.thread, spine: !path.spine })
  };
  const steps = useLiveQuery(() => db.steps.toArray());
  if (!steps) return null;

  return (
    <div>
      <div>
        <div>
          <input
            type="checkbox"
            checked={path.thread}
            onChange={handlePathChange1}
          />
          <label htmlFor="checkbox1">{ Path.Thread }</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={path.spine}
            onChange={handlePathChange2}
          />
          <label htmlFor="checkbox2">{ Path.Spine }</label>
        </div>
      </div>
      <div>
        {steps.map(step => (
          <StepView key={step.id} step={step} path={[path.thread ? Path.Thread : "no", path.spine ? Path.Spine : "no" ] as Array<string>} />
        ))}
      </div>
    </div>
  );
}


export default function Home() {
  return (
    <div>
      <Steps />
      <ResetDatabaseButton />
    </div>
  )
}

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-1 overflow-y-scroll">
//       <section className="min-w-full bg-slate-100 rounded-md ">
//         <h1>My Heading 1</h1>
//         <ul className="list-disc list-inside p-1 divide-y divide-gray-500">
//           <li className="bg-red-400 rounded-md p-1 border-2">Item 1</li>
//           <li className="bg-green-400 rounded-md p-1 border-2">Item 2</li>
//           <li className="bg-blue-400 rounded-md p-1 border-2">Item 3</li>
//           <li className="flex justify-between gap-x-6 py-5">
//             <div className="flex min-w-0 gap-x-4">
//               <div className="min-w-0 flex-auto">
//                 <p className="text-sm font-semibold leading-6 text-gray-900">Michael Foster</p>
//                 <p className="mt-1 truncate text-xs leading-5 text-gray-500">michael.foster@example.com</p>
//               </div>
//             </div>
//             <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
//               <p className="text-sm leading-6 text-gray-900">Co-Founder / CTO</p>
//               <p className="mt-1 text-xs leading-5 text-gray-500">Last seen </p>
//               {/* <time datetime="2023-01-23T13:23Z">3h ago</time> */}
//             </div>
//           </li>
//           <li className="flex justify-between gap-x-6 py-5">
//             <div className="flex min-w-0 gap-x-4">
//               <div className="min-w-0 flex-auto">
//                 <p className="text-sm font-semibold leading-6 text-gray-900">Michael Foster</p>
//                 <p className="mt-1 truncate text-xs leading-5 text-gray-500">michael.foster@example.com</p>
//               </div>
//             </div>
//             <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
//               <p className="text-sm leading-6 text-gray-900">Co-Founder / CTO</p>
//               <p className="mt-1 text-xs leading-5 text-gray-500">Last seen </p>
//               {/* <time datetime="2023-01-23T13:23Z">3h ago</time> */}
//             </div>
//           </li>
//         </ul>
//       </section>
//     </main>
//   )
// }
