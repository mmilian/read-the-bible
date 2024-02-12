"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import NextLink  from "next/link";

const RaiseTheIssue: React.FC = () => (
  <div>
  <header className="header">
    <h1>Zgłoszenie</h1>
    <NextLink href="/" className="btn" aria-label="/" scroll={true} title="Home">
      <FontAwesomeIcon icon={faArrowLeft} /> powrót
    </NextLink>
  </header>
  <div className="preview">
    <div className="card">
    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfz7MhYzFuyBy52E09CFS0JgO-f3ao_EblpPW9FBWaI-x6Jmg/viewform?embedded=true" 
    height="760">Loading…</iframe>
      </div>
    </div>
  </div>
);

export default RaiseTheIssue;
