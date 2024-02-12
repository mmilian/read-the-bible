"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import NextLink from "next/link";

const Intro: React.FC = () => (
  <div>
    <header className="header">
      <h1>Wprowadzenie</h1>
      <NextLink href="/" className="btn" aria-label="/" scroll={true} title="Home">
        <FontAwesomeIcon icon={faArrowLeft} /> powrót
      </NextLink>
    </header>
    <div className="card">
      <h1>Jak czytać Biblę </h1>

      <p>
        Wędrując w górach trzymaj się szlaku
        i przewodnika. Masz wtedy bezpieczeństwo,
        najładniejsze widoki i pewność dotarcia do
        celu.</p>
      <p>Gdy wędrujesz przez Biblię też powinieneś
        mieć wytyczony szlak i przewodnika. Ta mała
        książeczka będzie wytyczać ci tropy
        i prowadzić za rękę w czasie lektury. Nie
        czytaj Biblii od początku do końca, od deski
        do deski. Przynajmniej nie od razu. Musisz
        mieć pewną strategię, którą daje ta
        książeczka.</p>
      <br></br>
      <p>
        Ta strategia zawiera się w czterech punktach:
      </p>
      <ol>
        <li> Nić przewodnia
          Zapraszamy cię na początku do szybkiego
          rajdu przez całe Pismo Święte, przez
          najważniejsze osoby, epoki i wydarzenia. Nie
          będziesz ich poznawał dokładnie, to będzie
          tylko pierwszy rzut oka. W ten sposób
          Plik poglądowy 3 skasuj po obejrzeniu
          zdobędziesz nić przewodnią – zarys całości.
          Poznasz scenografię i głównych aktorów.
          Z każdego rozdziału znajduj i czytaj tylko
          fragmenty dotyczące nici przewodniej.</li>
        <li>
          Kręgosłup
          Potem zamień nitkę na kręgosłup. Przejdź raz
          jeszcze przez całość Biblii, przez poznane już
          osoby, epoki i wydarzenia, powtarzając
          i rozwijając ich wątki.
          W ten sposób pierwotny szkic zostanie
          przypomniany i uzupełniony kolejnymi
          szczegółami.
          Wróć do każdego rozdziału – tym razem
          znajduj i czytaj tylko fragmenty dotyczące
          kręgosłupa.
        </li>
      </ol>
    </div>
    <div className="card">
      <h1>Aplikacja</h1>
      <p>
        Zadaniem aplikacji jest pomóc Ci w wędrówce przez Pismo Święte.
        Po przeczytaniu każdego fragmentu, odznacz go w aplikacji.
        W ten sposób będziesz mógł śledzić swoje postępy.
      </p>
    </div>
    <div className="card">
      <NextLink href="/" className="btn" aria-label="/" scroll={true} title="Home">
        <FontAwesomeIcon icon={faArrowLeft} /> Zaczynamy!
      </NextLink>
    </div>
  </div>
);

export default Intro;