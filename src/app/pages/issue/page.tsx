"use client";

import { FiX } from "react-icons/fi";
import NextLink from "next/link";
import Link from "next/link";

const RaiseTheIssue: React.FC = () => (
  <div>
    <header className="header">
      <h1>Zgłoszenie</h1>

      <NextLink
        href="/"
        className="btn"
        data-variant="circle"
        data-color-scheme="primary"
        aria-label="/"
        scroll={true}
        title="Home"
      >
        <FiX size={25} />
      </NextLink>
    </header>
    <div className="preview">
      <div className="card">
        Jeśli zauważysz jakiś problem z działaniem aplikacji, jakiś element nie
        działa lub jest nieintuicyjny, lub masz pomysł na usprawnienie, proszę,
        zgłoś swoje uwagi za pomocą poniższego formularza kontaktowego.
        <br></br>
        <p>
          <Link href="https://docs.google.com/forms/d/e/1FAIpQLSfz7MhYzFuyBy52E09CFS0JgO-f3ao_EblpPW9FBWaI-x6Jmg/viewform?usp=sf_link">
            Formularz
          </Link>
        </p>
      </div>
    </div>
  </div>
);

export default RaiseTheIssue;
