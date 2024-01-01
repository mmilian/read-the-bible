"use client"
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Path, ReadingItem, ReadingStep, resetDatabase } from './models/db';
import { PropsWithChildren, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpenReader } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';

function ResetDatabaseButton() {
  return (
    <button
      className="large-button"
      onClick={() => {
        resetDatabase();
      }}
    >
      Reset database
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
      <div className="narrow">
        <Link href={`/reading/${item.passages}`}>
          <FontAwesomeIcon icon={faBookOpenReader} size="sm" />
        </Link>
      </div>
    </div>
  );
}


function StepView({ step, path }: PropsWithChildren<{ step: ReadingStep, path: string }>) {
  const items = useLiveQuery(
    () => db.items.where({ stepId: step.id }).toArray(),
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
        <h3> {path}</h3>
        {items.filter(el => el.path === path).map(item => (
          <ReadingItemView key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}


function Steps() {

  const [selectedPath, setSelectedPath] = useState<Path>(Path.Thread);

  const handlePathChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPath(event.target.value as Path);
    // Add your logic here
  };

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
        <select value={selectedPath} 
        onChange={handlePathChange}
        style={{
          fontSize: '18px', // Increase font size
          padding: '10px',  // Add some padding
          width: '200px',   // Set a specific width
          height: '50px'    // Set a specific height
        }}>
          <option value={Path.Thread}>{Path.Thread}</option>
          <option value={Path.Spine}>{Path.Spine}</option>
        </select>
      </div>
      <div>
        {steps.map(step => (
          <StepView key={step.id} step={step} path={selectedPath} />
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

