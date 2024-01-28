"use client";
import { useLiveQuery } from "dexie-react-hooks";
import { db, Path, ReadingItem, ReadingStep, resetDatabase } from "./models/db";
import { PropsWithChildren, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpenReader } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

function ResetDatabaseButton() {
  return (
    <div className="preview">
      <div className="card">
        <button
          className="btn"
          onClick={() => {
            resetDatabase();
          }}
        >
          Reset database
        </button>
      </div>
    </div>
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
      readingId: item.id,
      completed: false,
    };
    db.progress.add(progress);
    progressList.push(progress);
  }
  const progress = progressList[0];
  return (
    <div className={"readingItem " + (progress.completed ? "done" : "")}>
      <div className="readingItemCheck">
        <input
          id={progress.readingId}
          type="checkbox"
          checked={!!progress.completed}
          onChange={(ev) =>
            db.progress.update(progress, {
              completed: ev.target.checked,
            })
          }
          className="form-control"
        />
        <label htmlFor={progress.readingId}>{item.passages}</label>
      </div>

      <Link href={`/reading/${item.passages}`} className="readingItemLink">
        <FontAwesomeIcon icon={faBookOpenReader} size="sm" />
        <span className="visuallyHidden">przeczytaj fragment</span>
      </Link>
    </div>
  );
}

function StepView({
  step,
  path,
}: PropsWithChildren<{ step: ReadingStep; path: string }>) {
  const items = useLiveQuery(
    () => db.items.where({ stepId: step.id }).toArray(),
    [step.id]
  );
  if (!items) return null;

  return (
    <div className="card">
      <h2 className="readingTitle">{step.title}</h2>
      <p className="readingDescription">{step.introduction}</p>
      <div className="readingList">
        {items
          .filter((el) => el.path === path)
          .map((item) => (
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
    setPath({ thread: !path.thread, spine: path.spine });
  };
  const handlePathChange2 = () => {
    setPath({ thread: path.thread, spine: !path.spine });
  };
  const steps = useLiveQuery(() => db.steps.toArray());
  if (!steps) return null;

  return (
    <div>
      <header className="header">
        <h1 className="logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="150"
            height="26"
            viewBox="0 0 150 26"
          >
            <title>Read the bible</title>
            <path
              className="logoName"
              fill-rule="evenodd"
              d="M69.822 21.69c-.574 0-1.114-.07-1.619-.209-.505-.122-.958-.392-1.358-.81-.4-.435-.714-1.07-.94-1.906-.21-.853-.314-1.985-.314-3.396 0-1.723.174-3.116.523-4.179.365-1.08.844-1.863 1.436-2.35.61-.488 1.288-.732 2.037-.732.4 0 .758.044 1.071.131.314.087.575.218.784.392V3.198c0-.33.052-.557.157-.68.121-.138.339-.217.652-.234.314-.035.75-.052 1.306-.052v18.675c-.418.209-.949.392-1.593.548-.627.157-1.34.235-2.142.235Zm.079-1.906c.296 0 .574-.026.836-.079.26-.07.496-.174.705-.313v-9.09a1.063 1.063 0 0 0-.523-.26 2.423 2.423 0 0 0-.679-.08c-.278 0-.557.07-.835.21-.28.14-.532.4-.758.783-.226.366-.4.888-.522 1.568-.122.661-.183 1.532-.183 2.611 0 .993.043 1.794.13 2.403.087.61.218 1.08.392 1.41.174.314.374.532.6.654.245.122.523.183.837.183Zm19.88 1.645V3.198c0-.33.051-.557.156-.68.122-.138.33-.217.627-.234.313-.035.757-.052 1.332-.052v6.895c.4-.348.862-.6 1.384-.757a5.02 5.02 0 0 1 1.541-.262c.749 0 1.315.14 1.698.418.4.261.67.645.81 1.15.139.505.208 1.131.208 1.88v9.455c0 .14-.043.235-.13.288-.07.052-.261.087-.575.104-.296.017-.783.026-1.462.026v-9.298c0-.575-.096-1.063-.288-1.463-.174-.4-.583-.6-1.227-.6-.296 0-.618.052-.967.156-.348.104-.679.296-.992.575V21.01c0 .14-.035.235-.105.288-.052.052-.226.087-.522.104-.296.017-.792.026-1.489.026Zm41.215.261c-.697 0-1.306-.07-1.829-.209-.505-.139-.914-.33-1.227-.574V3.224c0-.33.052-.566.156-.705.122-.14.331-.218.627-.235.314-.035.758-.052 1.332-.052v6.79a4.465 4.465 0 0 1 1.202-.652c.452-.175.984-.262 1.593-.262.696 0 1.28.166 1.75.497.47.33.827.87 1.071 1.619s.365 1.759.365 3.03c0 1.497-.104 2.76-.313 3.787-.191 1.027-.47 1.846-.836 2.455-.348.61-.74 1.08-1.175 1.41a3.683 3.683 0 0 1-1.358.628c-.47.104-.923.156-1.358.156Zm.287-1.88c.226 0 .479-.07.757-.21.279-.139.54-.417.784-.835s.444-1.027.601-1.828c.174-.819.261-1.89.261-3.213 0-.94-.07-1.68-.209-2.22-.139-.54-.34-.923-.601-1.15-.244-.226-.575-.339-.992-.339-.331 0-.653.061-.967.183a2.482 2.482 0 0 0-.862.548v8.724c.122.087.279.166.47.235.192.07.444.105.758.105Zm6.68-16.612v18.231c.714 0 1.21-.009 1.489-.026.296-.017.47-.052.522-.104.07-.053.105-.148.105-.288V2.231c-.558 0-.993.018-1.306.053-.314.017-.531.096-.653.235-.105.122-.157.348-.157.679Zm6.578 18.231c.523.174 1.08.261 1.672.261a8.2 8.2 0 0 0 1.802-.183c.557-.122 1.001-.296 1.332-.522.331-.226.496-.47.496-.731 0-.21-.017-.444-.052-.706a2.254 2.254 0 0 0-.157-.73 5.146 5.146 0 0 1-1.41.6 5.771 5.771 0 0 1-1.541.209c-.435 0-.81-.061-1.123-.183a1.932 1.932 0 0 1-.758-.653c-.191-.296-.339-.714-.444-1.254a11.165 11.165 0 0 1-.121-1.411c.385-.003.844-.011 1.375-.025.662-.035 1.358-.079 2.09-.13.731-.053 1.393-.14 1.985-.262.121-.47.2-1.01.235-1.62.052-.609.078-1.2.078-1.775 0-1.41-.279-2.464-.836-3.16-.557-.697-1.384-1.046-2.481-1.046a5.66 5.66 0 0 0-1.698.262c-.557.174-1.053.513-1.489 1.018-.435.505-.783 1.254-1.044 2.246-.262.993-.392 2.308-.392 3.944 0 1.271.096 2.308.287 3.109.209.8.496 1.419.862 1.854.383.435.827.731 1.332.888Zm-.295-7c.023-.644.07-1.201.138-1.671.122-.714.288-1.271.497-1.672.209-.418.444-.705.705-.862.278-.174.566-.261.862-.261.574 0 .958.2 1.149.6.209.384.322 1.045.34 1.986 0 .243-.009.505-.027.783-.017.279-.052.54-.104.784a7.05 7.05 0 0 1-1.28.235c-.487.035-.975.06-1.462.078h-.818Zm-20.898-5.093v12.093c.731 0 1.245-.009 1.541-.026.296-.017.47-.052.522-.104.07-.053.105-.148.105-.288V8.37c-.575 0-1.019.017-1.332.052-.314.017-.532.096-.653.235-.122.122-.183.348-.183.679Zm.235-3.134c.191.226.452.348.783.365.401 0 .697-.148.888-.444.209-.313.314-.731.314-1.253.017-.558-.052-.95-.209-1.176-.157-.226-.435-.34-.836-.34-.418 0-.723.149-.914.445-.192.278-.296.653-.314 1.123 0 .61.096 1.036.288 1.28Zm-10.134 15.227V3.642c0-.157.044-.279.131-.366.104-.087.296-.13.574-.13h2.586c.522 0 1.045.06 1.567.183.523.104.993.304 1.411.6.418.279.757.68 1.018 1.202.261.522.392 1.21.392 2.063 0 .958-.131 1.733-.392 2.325-.261.592-.583 1.045-.966 1.358-.383.296-.766.47-1.149.522.296.018.618.088.966.21.366.104.705.295 1.019.574.331.261.592.636.783 1.123.209.488.314 1.123.314 1.907 0 .87-.087 1.645-.262 2.324-.156.68-.391 1.263-.705 1.75a4.572 4.572 0 0 1-1.071 1.228c-.418.313-.87.548-1.358.705-.487.14-1.01.21-1.567.21h-3.291Zm2.168-1.854h1.175c.331 0 .636-.079.914-.235.296-.157.558-.4.784-.732.226-.348.401-.783.522-1.306.14-.522.209-1.158.209-1.906 0-.68-.061-1.21-.182-1.594-.105-.4-.27-.696-.497-.888a1.386 1.386 0 0 0-.757-.391 5.575 5.575 0 0 0-.967-.079h-1.201v7.13Zm0-8.96h1.28c.365 0 .688-.104.966-.313.296-.208.523-.54.679-.992.174-.453.261-1.027.261-1.724 0-.714-.095-1.254-.287-1.62-.174-.365-.409-.609-.705-.73a2.183 2.183 0 0 0-.94-.21h-1.254v5.59Zm-13.57 10.814a5.25 5.25 0 0 0 1.672.261 8.2 8.2 0 0 0 1.802-.183c.557-.122 1.001-.296 1.332-.522.331-.226.496-.47.496-.731 0-.21-.017-.444-.052-.706a2.28 2.28 0 0 0-.157-.73 5.146 5.146 0 0 1-1.41.6 5.771 5.771 0 0 1-1.541.209c-.436 0-.81-.061-1.123-.183a1.932 1.932 0 0 1-.758-.653c-.191-.296-.339-.714-.444-1.254a11.165 11.165 0 0 1-.121-1.411c.385-.003.843-.011 1.375-.025.661-.035 1.358-.079 2.089-.13.732-.053 1.393-.14 1.985-.262.122-.47.201-1.01.235-1.62a20.5 20.5 0 0 0 .079-1.775c0-1.41-.279-2.464-.836-3.16-.557-.697-1.384-1.046-2.481-1.046a5.66 5.66 0 0 0-1.698.262c-.557.174-1.054.513-1.489 1.018-.435.505-.783 1.254-1.045 2.246-.26.993-.391 2.308-.391 3.944 0 1.271.095 2.308.287 3.109.209.8.496 1.419.862 1.854.383.435.827.731 1.332.888Zm-.295-7c.023-.644.069-1.201.138-1.671.122-.714.288-1.271.496-1.672.209-.418.444-.705.706-.862.278-.174.566-.261.862-.261.574 0 .957.2 1.149.6.209.384.322 1.045.339 1.986 0 .243-.008.505-.026.783-.017.279-.052.54-.104.784a7.05 7.05 0 0 1-1.28.235c-.488.035-.975.06-1.463.078h-.817Zm-19.13-9.298v16.298c.697 0 1.193-.009 1.489-.026.296-.017.47-.052.522-.104.07-.053.105-.148.105-.288V5.131h3.213c.156 0 .27-.026.34-.079.069-.07.103-.182.103-.339V3.146h-8.88c-.296 0-.444.14-.444.418V5.13h3.552ZM58.63 21.56c.453.087.923.13 1.41.13.854 0 1.585-.096 2.194-.287.61-.192 1.089-.392 1.437-.6a39.79 39.79 0 0 0 .104-2.3c.018-.887.026-1.828.026-2.82.018-1.01.027-2.011.027-3.004v-1.384c0-1.184-.262-2.011-.784-2.481-.505-.47-1.323-.706-2.455-.706-.993 0-1.846.087-2.56.262-.714.156-1.184.304-1.41.444a.626.626 0 0 0-.235.313c-.035.14-.053.27-.053.392 0 .174.018.374.053.6.035.21.113.418.235.627.383-.156.888-.296 1.515-.418.627-.121 1.28-.182 1.959-.182.348 0 .635.052.861.156a.975.975 0 0 1 .549.47c.14.21.209.523.209.94v2.064a3.375 3.375 0 0 0-.966-.261 6.938 6.938 0 0 0-.967-.078c-.435 0-.862.052-1.28.156a2.494 2.494 0 0 0-1.123.627c-.33.296-.592.732-.783 1.306-.192.557-.288 1.289-.288 2.194 0 .906.105 1.62.314 2.142.209.522.487.923.836 1.201.348.262.74.427 1.175.497Zm2.429-1.776c-.261.087-.531.13-.81.13a2.91 2.91 0 0 1-.705-.078 1.162 1.162 0 0 1-.548-.314c-.157-.174-.279-.409-.366-.705-.07-.296-.105-.679-.105-1.15 0-.574.053-1.035.157-1.383.105-.349.244-.61.418-.784.174-.191.374-.313.6-.366.245-.07.506-.104.784-.104.174 0 .375.017.601.052.244.035.453.096.627.183 0 .47-.009.975-.026 1.515 0 .54-.009 1.053-.026 1.54a9.8 9.8 0 0 1-.052 1.15c-.105.122-.288.227-.549.314Zm-9.987 1.906c-.592 0-1.149-.087-1.671-.26a2.908 2.908 0 0 1-1.332-.889c-.366-.435-.653-1.053-.862-1.854-.192-.801-.288-1.838-.288-3.109 0-1.636.131-2.951.392-3.944.261-.992.61-1.74 1.045-2.246.435-.505.931-.844 1.489-1.018a5.66 5.66 0 0 1 1.697-.262c1.097 0 1.925.349 2.482 1.045.557.697.836 1.75.836 3.16 0 .575-.027 1.167-.079 1.777a8.395 8.395 0 0 1-.235 1.619 15.29 15.29 0 0 1-1.985.261c-.731.052-1.428.096-2.09.13-.53.015-.99.023-1.374.026.017.545.057 1.016.12 1.411.105.54.253.958.445 1.254.209.296.461.514.757.653.314.122.688.183 1.123.183a5.77 5.77 0 0 0 1.541-.21c.523-.138.993-.339 1.41-.6.088.21.14.453.158.732.034.26.052.496.052.705 0 .26-.166.505-.496.731-.331.226-.775.4-1.333.522-.54.122-1.14.183-1.802.183Zm-1.828-8.932c-.069.47-.115 1.027-.139 1.671h.818c.488-.017.975-.043 1.463-.078.505-.052.931-.13 1.28-.235.052-.244.087-.505.104-.784.017-.278.026-.54.026-.783-.017-.94-.13-1.602-.34-1.985-.19-.4-.574-.601-1.149-.601-.296 0-.583.087-.861.261-.262.157-.497.444-.706.862-.209.4-.374.958-.496 1.672Zm-9.587 1.253v7c0 .14-.035.235-.105.288-.052.052-.226.087-.522.104-.296.017-.793.026-1.49.026V3.564l.053-.21c.052-.139.183-.208.392-.208H40.57c1.097 0 2.002.183 2.716.548.714.349 1.236.906 1.567 1.672.349.749.523 1.732.523 2.951 0 1.08-.131 1.985-.392 2.717-.244.714-.592 1.288-1.045 1.724-.26.26-.544.479-.854.658.229.304.488.711.776 1.222.383.662.74 1.515 1.07 2.56.331 1.045.54 2.298.627 3.76 0 .193-.052.332-.156.419-.105.07-.41.104-.914.104-.157 0-.349-.008-.575-.026-.209 0-.435-.008-.68-.026-.086-1.497-.27-2.751-.548-3.761-.26-1.027-.548-1.837-.862-2.43-.274-.565-.519-.98-.734-1.246-.162.013-.326.02-.493.02h-.94Zm0-1.959V5h1.306c.522 0 .931.13 1.227.392.314.244.531.61.653 1.097.122.488.183 1.062.183 1.724 0 .923-.087 1.672-.261 2.246-.174.557-.427.966-.758 1.228-.313.244-.714.365-1.201.365h-1.15Z"
              clip-rule="evenodd"
            />
            <path
              className="logoSignature"
              fillRule="evenodd"
              d="M5.61 0c2.891 0 5.587.83 7.854 2.26v5.985H8.88a1.057 1.057 0 0 0 0 2.114h4.585v15.643a12.397 12.397 0 0 0-7.854-2.78c-1.444 0-2.829.244-4.114.692-.343.12-.724.067-1.022-.14A1.101 1.101 0 0 1 0 22.871V1.861C0 1.392.3.974.748.818 2.27.288 3.908 0 5.61 0ZM15.71 10.359v15.643a12.397 12.397 0 0 1 7.854-2.78c1.445 0 2.829.244 4.114.692.344.12.725.067 1.022-.14.297-.207.474-.544.474-.903V1.861c0-.469-.3-.887-.748-1.043A14.757 14.757 0 0 0 23.563 0c-2.891 0-5.587.83-7.854 2.26v5.985h4.374a1.057 1.057 0 0 1 0 2.114h-4.374Z"
              clip-rule="evenodd"
            />
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
      </header>
      <main className="main">
        {steps.map((step) => (
          <StepView key={step.id} step={step} path={selectedPath} />
        ))}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <Steps />
      <ResetDatabaseButton />
    </div>
  );
}
