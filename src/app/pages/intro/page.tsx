"use client";
import { FiX } from "react-icons/fi";
import NextLink from "next/link";
import Link from "next/link";

const Intro: React.FC = () => (
  <div className="app bg-surface">
    <header className="header">
      <h1>Wprowadzenie</h1>
      <NextLink
        href="/"
        className="btn mr-g"
        data-variant="circle"
        data-color-scheme="primary"
        aria-label="/"
        scroll={true}
        title="Home"
      >
        <FiX size={25} />
      </NextLink>
    </header>
    <main className="main">
      <h2 className="mt-300">Jak czytać Biblię </h2>
      <p>
        Wędrując w górach trzymasz się szlaku i przewodnika, co daje Ci
        bezpieczeństwo, najładniejsze widoki i pewność dotarcia do celu.
      </p>
      <p>
        Gdy wędrujesz przez Biblię też powinieneś mieć wytyczony szlak i
        przewodnika. Nie czytaj Biblii od początku do końca, od deski do deski.
        Przynajmniej nie od razu. Musisz mieć pewną strategię. Ta mała aplikacja
        została stworzona na bazie książki{" "}
        <Link href="https://fundacjanaszawinnica.pl/pl/p/Jak-czytac-i-rozumiec-Pismo-Swiete-Ilona-Krawczyk-Krajczynska/41">
          {" "}
          Jak czytać i rozumieć Pismo Święte
        </Link>{" "}
        autorstwa Ilony Krawczyk - Krajczyńskiej, wydanej przez
        <Link href="https://fundacjanaszawinnica.pl/pl/p/Jak-czytac-i-rozumiec-Pismo-Swiete-Ilona-Krawczyk-Krajczynska/41">
          {" "}
          Fundacje Nasza Winnica{" "}
        </Link>
        , będzie wytyczać ci tropy i prowadzić za rękę w czasie lektury.
        Książeczka proponuje właśnie strategię czytania Biblii.
      </p>
      <hr />
      <p>Ta strategia zawiera się w dwóch punktach:</p>
      <h3 className="text-primary">1. Nić przewodnia</h3>
      <p>
        Zapraszamy cię na początku do szybkiego rajdu przez całe Pismo Święte,
        przez najważniejsze osoby, epoki i wydarzenia. Nie będziesz ich poznawał
        dokładnie, to będzie tylko pierwszy rzut oka. W ten sposób zdobędziesz
        nić przewodnią - zarys całości. Poznasz scenografię i głównych aktorów.
        Z każdego rozdziału czytaj fragmenty dotyczące nici przewodniej.
      </p>
      <h3 className="text-primary">2. Kręgosłup</h3>
      <p>
        Potem zamień nitkę na kręgosłup. Przejdź raz jeszcze przez całość
        Biblii, przez poznane już osoby, epoki i wydarzenia, powtarzając i
        rozwijając ich wątki. W ten sposób pierwotny szkic zostanie przypomniany
        i uzupełniony kolejnymi szczegółami. Wróć do każdego rozdziału - tym
        razem czytaj fragmenty dotyczące kręgosłupa.{" "}
      </p>
      <hr />
      <h1>Aplikacja</h1>
      <p>
        Zadaniem aplikacji jest pomóc Ci w wędrówce przez Pismo Święte. Po
        przeczytaniu każdego fragmentu, odznacz go w aplikacji. W ten sposób
        będziesz mógł śledzić swoje postępy. Jak skończysz czytać &#34;Nić
        przewodnią&#34; przełącz się za pomocą przycisku (na górze ekranu) na
        widok &#34;Kręgosłup&#34;.
      </p>

      <NextLink
        href="/"
        className="btn"
        data-color-scheme="primary"
        aria-label="/"
        scroll={true}
        title="Home"
      >
        Zaczynamy!
      </NextLink>
    </main>
  </div>
);

export default Intro;
