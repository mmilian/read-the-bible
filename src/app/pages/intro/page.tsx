"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import NextLink from "next/link";
import Link from "next/link";

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
        aplikacja stowrzona na bazie książki <Link href="https://fundacjanaszawinnica.pl/pl/p/Jak-czytac-i-rozumiec-Pismo-Swiete-Ilona-Krawczyk-Krajczynska/41"> Jak czytać i rozumieć Pismo Święte</Link> autorstwa Ilony Krawczyk - Krajczyńskiej, wydanej przez 
        <Link href="https://fundacjanaszawinnica.pl/pl/p/Jak-czytac-i-rozumiec-Pismo-Swiete-Ilona-Krawczyk-Krajczynska/41"> Fundacje Nasza Winnica </Link>,  będzie wytyczać ci tropy i prowadzić za rękę w czasie lektury. 
        Nie czytaj Biblii od początku do końca, od deski
        do deski. Przynajmniej nie od razu. Musisz
        mieć pewną strategię, którą daje ta
        książeczka.</p>
      <br></br>
      <p>
        Ta strategia zawiera się w dwóch punktach:
      </p>
      <ol>
        <li> Nić przewodnia
        <p>
          Zapraszamy cię na początku do szybkiego
          rajdu przez całe Pismo Święte, przez
          najważniejsze osoby, epoki i wydarzenia. Nie
          będziesz ich poznawał dokładnie, to będzie
          tylko pierwszy rzut oka. W ten sposób
          zdobędziesz nić przewodnią - zarys całości.
          Poznasz scenografię i głównych aktorów.
          Z każdego rozdziału znajduj i czytaj tylko
          fragmenty dotyczące nici przewodniej.
          </p>
          </li>
        <li>
          Kręgosłup
          <p>
          Potem zamień nitkę na kręgosłup. Przejdź raz
          jeszcze przez całość Biblii, przez poznane już
          osoby, epoki i wydarzenia, powtarzając
          i rozwijając ich wątki.
          W ten sposób pierwotny szkic zostanie
          przypomniany i uzupełniony kolejnymi
          szczegółami.
          Wróć do każdego rozdziału - tym razem
          znajduj i czytaj tylko fragmenty dotyczące
          kręgosłupa. </p>
        </li>
      </ol>
    </div>
    <div className="card">
      <h1>Aplikacja</h1>
      <p>
        Zadaniem aplikacji jest pomóc Ci w wędrówce przez Pismo Święte.
        Po przeczytaniu każdego fragmentu, odznacz go w aplikacji.
        W ten sposób będziesz mógł śledzić swoje postępy.
        Jak skończysz czytać "Nić przewodnią" przełącz za pomocą przycisku widok na "Kręgosłup".
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