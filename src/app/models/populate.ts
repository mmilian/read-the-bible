import { ReadingItem, ReadingStep, db } from "./db";

export enum Path {
  Thread = "Nić przewodnia",
  Spine = "Kręgosłup",
}

const steps: ReadingStep[] = [
  {
    id: "abraham",
    title: "Abraham",
    introduction:
      "Historia biblijna zaczyna się od Abrahama. Niezwykły człowiek wiary i modlitwy, pierwszy z patriarchów. Bezgranicznie zaufał Bogu, który niejednokrotnie do niego przemawiał. Sędziwy Abraham nazywany jest ojcem narodów.",
  },
  {
    id: "izaak",
    title: "Izaak",
    introduction:
      "Drugi patriarcha ludu Izraela. Syn Abrahama, spełnienie Bożej obietnicy. Pomimo, iż nie był jedynym, ani nawet pierwszym synem Abrahama został wybrańcem. Już na rok przed jego narodzeniem Pan zapowiedział, że to właśnie z Izaakiem zawrze swoje przymierze.",
  },
  {
    id: "jakub",
    title: "Jakub",
    introduction:
      "Młodszy z bliźniąt, które urodziły się Izaakowi. Chociaż błogosławieństwo swego ojca zdobył podstępem i walczył z Bożym aniołem, Pan obdarzył go licznym potomstwem i dał mu w posiadanie ziemie jego przodków, podtrzymując tym samym swoje przymierze.",
  },
  {
    id: "józef-i-bracia",
    title: "Józef i bracia",
    introduction:
      "Jeden z 12 synów Jakuba. Umiłowany przez ojca stał się znienawidzony przez braci. Jego dar interpretacji snów uratował Egipcjan przed głodem a jemu samemu zapewnił godne stanowisko u boku Faraona. Tak Józef sprowadził ojca i braci do Egiptu.",
  },
  {
    id: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu",
    title: "Niewola, Wyjście z Egiptu, wędrówka do Kanaanu",
    introduction:
      "Od Księgi Wyjścia przez Księgę Kapłańską, Księgę Liczb i Powtórzonego Prawa poznajemy niezwykłą historię ludu Izraela, który Mojżesz wyprowadził z niewoli, który przyjął Boże prawo i doświadczył licznych cudów, który co chwilę buntował się przeciwko Bogu, to znowu nawracał, aż po 40 latach dotarł do Ziemi, o której słyszał tylko legendy.",
  },
  {
    id: "jozue",
    title: "Jozue",
    introduction:
      "Mężny i wierny Syn Nuna, urodzony jeszcze w niewoli egipskiej. Namaszczony przed śmiercią Mojżesza na jego następcę wypełnił Bożą obietnicę - wprowadził Izraelitów do Ziemi Obiecanej, podbił ją i osiedlił.",
  },
  {
    id: "czasy-sędziów",
    title: "Czasy Sędziów",
    introduction:
      "Okres, kiedy Izraelici osiedli Kanaan i musieli zmierzyć się z codziennością: rolnictwem, handlem, rzemiosłem. Sędziowie to nikt inny jak obdarzeni charyzmatem wybrańcy Boży, którzy czuwają nad bezpieczeństwem fizycznym, materialnym i religijnym Narodu.",
  },
  {
    id: "saul",
    title: "Saul",
    introduction:
      "Pierwszy król Izraela, namaszczony na tę funkcję przez ostatniego z sędziów – Samuela. Przywódca, który zmierzył się z Filistynami i zjednoczył plemiona Izraela. Niestety głosu ludu lękał się bardziej niż głosu Boga, przez co przyszło mu wiele stracić…",
  },
  {
    id: "dawid",
    title: "Dawid",
    introduction:
      "Był bardzo młody, kiedy został namaszczony na następcę Saula. Skromny i utalentowany pasterz przeszedł jednak długą, niebezpieczną drogę zanim cały lud Izraela uznał w nim króla. Pomimo błędów jakie popełniał, Bóg nie odwrócił się od niego, a lud miał w nim sprawiedliwego i walecznego władcę.",
  },
  {
    id: "salomon",
    title: "Salomon",
    introduction:
      "„Proś o to, co mam ci dać” (1Krl 3,5-6) od tych słów zaczyna się pierwsza „rozmowa” Boga z Królem Salomonem. Od tej rozmowy Salomon staje się najroztropniejszym władcą Izraela, a wraz z mądrością, o którą tak skromnie prosił otrzymuje od Pana niezliczone bogactwo i potęgę.",
  },
  {
    id: "podział-i-upadek-północnego-królestwa",
    title: "Podział i upadek północnego królestwa",
    introduction:
      "Miasta bogaciły się i rozrastały. Już w chwili śmierci Salomona widać było, że rozwój materialny destrukcyjnie wpływał na rozwój duchowy. W Izraelu na dobre rozgościł się politeizm, zapominano o przymierzu. Tak jak zapowiedział Bóg Salomonowi doszło do buntu a podział królestwa stał się faktem.",
  },
];

//   {
//     id: "abraham",
//     title: "1. Abraham",
//     introduction:
//       "Historia biblijna zaczyna się od Abrahama. Niezwykły człowiek wiary i modlitwy, pierwszy z patriarchów. Bezgranicznie zaufał Bogu, który niejednokrotnie do niego przemawiał. Sędziwy Abraham nazywany jest ojcem narodów.",
//   },
//   {
//     id: "izaak",
//     title: "2. Izaak",
//     introduction:
//       "Drugi patriarcha ludu Izraela. Syn Abrahama, spełnienie Bożej obietnicy. Pomimo, iż nie był jedynym, ani nawet pierwszym synem Abrahama, został wybrańcem. Już na rok przed jego narodzeniem Pan zapowiedział, że to właśnie z Izaakiem zawrze swoje przymierze.",
//   },
// ];

const items: ReadingItem[] = [
  {
    id: "abraham-2",
    stepId: "abraham",
    path: "Nić przewodnia",
    passages: "Rdz 12-13",
  },
  {
    id: "abraham-3",
    stepId: "abraham",
    path: "Nić przewodnia",
    passages: "Rdz 18, 1-15",
  },
  {
    id: "abraham-4",
    stepId: "abraham",
    path: "Nić przewodnia",
    passages: "Rdz 21, 1-8",
  },
  {
    id: "abraham-5",
    stepId: "abraham",
    path: "Kręgosłup",
    passages: "Rdz 12-14",
  },
  {
    id: "abraham-6",
    stepId: "abraham",
    path: "Kręgosłup",
    passages: "Rdz 15-19",
  },
  {
    id: "abraham-7",
    stepId: "abraham",
    path: "Kręgosłup",
    passages: "Rdz 21-22",
  },
  {
    id: "izaak-8",
    stepId: "izaak",
    path: "Nić przewodnia",
    passages: "Rdz 17,15-21",
  },
  {
    id: "izaak-9",
    stepId: "izaak",
    path: "Nić przewodnia",
    passages: "Rdz 21,1-8",
  },
  {
    id: "izaak-10",
    stepId: "izaak",
    path: "Nić przewodnia",
    passages: "Rdz 25,19-21",
  },
  {
    id: "izaak-11",
    stepId: "izaak",
    path: "Kręgosłup",
    passages: "Rdz 24",
  },
  {
    id: "izaak-12",
    stepId: "izaak",
    path: "Kręgosłup",
    passages: "Rdz 26,1-35",
  },
  {
    id: "izaak-13",
    stepId: "izaak",
    path: "Kręgosłup",
    passages: "Rdz 35,27-29",
  },
  {
    id: "jakub-14",
    stepId: "jakub",
    path: "Nić przewodnia",
    passages: "Rdz 25,21-34",
  },
  {
    id: "jakub-15",
    stepId: "jakub",
    path: "Nić przewodnia",
    passages: "Rdz 28,1-22",
  },
  {
    id: "jakub-16",
    stepId: "jakub",
    path: "Nić przewodnia",
    passages: "Rdz 32",
  },
  {
    id: "jakub-17",
    stepId: "jakub",
    path: "Kręgosłup",
    passages: "Rdz 27-31",
  },
  {
    id: "jakub-18",
    stepId: "jakub",
    path: "Kręgosłup",
    passages: "Rdz 33-35",
  },
  {
    id: "jakub-19",
    stepId: "jakub",
    path: "Kręgosłup",
    passages: "Rdz 49-50",
  },
  {
    id: "józef-i-bracia-20",
    stepId: "józef-i-bracia",
    path: "Nić przewodnia",
    passages: "Rdz 37",
  },
  {
    id: "józef-i-bracia-21",
    stepId: "józef-i-bracia",
    path: "Nić przewodnia",
    passages: "Rdz 39",
  },
  {
    id: "józef-i-bracia-22",
    stepId: "józef-i-bracia",
    path: "Nić przewodnia",
    passages: "Rdz 41",
  },
  {
    id: "józef-i-bracia-23",
    stepId: "józef-i-bracia",
    path: "Nić przewodnia",
    passages: "Rdz 47",
  },
  {
    id: "józef-i-bracia-24",
    stepId: "józef-i-bracia",
    path: "Kręgosłup",
    passages: "Rdz 39-41",
  },
  {
    id: "józef-i-bracia-25",
    stepId: "józef-i-bracia",
    path: "Kręgosłup",
    passages: "Rdz 42-43",
  },
  {
    id: "józef-i-bracia-26",
    stepId: "józef-i-bracia",
    path: "Kręgosłup",
    passages: "Rdz 47-50",
  },
  {
    id: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu-27",
    stepId: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu",
    path: "Nić przewodnia",
    passages: "Wj 1,1-14",
  },
  {
    id: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu-28",
    stepId: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu",
    path: "Nić przewodnia",
    passages: "Wj 3,1-15",
  },
  {
    id: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu-29",
    stepId: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu",
    path: "Nić przewodnia",
    passages: "Wj 13-14",
  },
  {
    id: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu-30",
    stepId: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu",
    path: "Nić przewodnia",
    passages: "Wj 19,1-20,21",
  },
  {
    id: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu-31",
    stepId: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu",
    path: "Nić przewodnia",
    passages: "Kpł 26",
  },
  {
    id: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu-32",
    stepId: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu",
    path: "Nić przewodnia",
    passages: "Lb 13",
  },
  {
    id: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu-33",
    stepId: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu",
    path: "Kręgosłup",
    passages: "Wj 5-8",
  },
  {
    id: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu-34",
    stepId: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu",
    path: "Kręgosłup",
    passages: "Wj 9-11",
  },
  {
    id: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu-35",
    stepId: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu",
    path: "Kręgosłup",
    passages: "Wj 12-15",
  },
  {
    id: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu-36",
    stepId: "niewola,-wyjście-z-egiptu,-wędrówka-do-kanaanu",
    path: "Kręgosłup",
    passages: "Wj 32-34",
  },
  {
    id: "jozue-37",
    stepId: "jozue",
    path: "Nić przewodnia",
    passages: "Joz 1",
  },
  {
    id: "jozue-38",
    stepId: "jozue",
    path: "Nić przewodnia",
    passages: "Joz 6,1-21",
  },
  {
    id: "jozue-39",
    stepId: "jozue",
    path: "Nić przewodnia",
    passages: "Joz 21, 43-45",
  },
  {
    id: "jozue-40",
    stepId: "jozue",
    path: "Kręgosłup",
    passages: "Joz 1-4",
  },
  {
    id: "jozue-41",
    stepId: "jozue",
    path: "Kręgosłup",
    passages: "Joz 5-7",
  },
  {
    id: "jozue-42",
    stepId: "jozue",
    path: "Kręgosłup",
    passages: "Joz 8-11",
  },
  {
    id: "jozue-43",
    stepId: "jozue",
    path: "Kręgosłup",
    passages: "Joz 23-24",
  },
  {
    id: "czasy-sędziów-44",
    stepId: "czasy-sędziów",
    path: "Nić przewodnia",
    passages: "Sdz 1-2",
  },
  {
    id: "czasy-sędziów-45",
    stepId: "czasy-sędziów",
    path: "Nić przewodnia",
    passages: "Sdz 3,7-31",
  },
  {
    id: "czasy-sędziów-46",
    stepId: "czasy-sędziów",
    path: "Kręgosłup",
    passages: "Sdz 3-5",
  },
  {
    id: "czasy-sędziów-47",
    stepId: "czasy-sędziów",
    path: "Kręgosłup",
    passages: "Sdz 6-7",
  },
  {
    id: "czasy-sędziów-48",
    stepId: "czasy-sędziów",
    path: "Kręgosłup",
    passages: "Sdz 13-16",
  },
  {
    id: "saul-49",
    stepId: "saul",
    path: "Nić przewodnia",
    passages: "1Sm 9,15-10,12",
  },
  {
    id: "saul-50",
    stepId: "saul",
    path: "Nić przewodnia",
    passages: "1Sm 13",
  },
  {
    id: "saul-51",
    stepId: "saul",
    path: "Nić przewodnia",
    passages: "1Sm 14,47-52",
  },
  {
    id: "saul-52",
    stepId: "saul",
    path: "Kręgosłup",
    passages: "1Sm 7-12",
  },
  {
    id: "saul-53",
    stepId: "saul",
    path: "Kręgosłup",
    passages: "1Sm 14-16",
  },
  {
    id: "saul-54",
    stepId: "saul",
    path: "Kręgosłup",
    passages: "1Krn 10,1-14",
  },
  {
    id: "dawid-55",
    stepId: "dawid",
    path: "Nić przewodnia",
    passages: "1Sm 16, 1-13",
  },
  {
    id: "dawid-56",
    stepId: "dawid",
    path: "Nić przewodnia",
    passages: "1Sm 17,32-58",
  },
  {
    id: "dawid-57",
    stepId: "dawid",
    path: "Nić przewodnia",
    passages: "1Sm 18,5-16",
  },
  {
    id: "dawid-58",
    stepId: "dawid",
    path: "Nić przewodnia",
    passages: "1Sm 24",
  },
  {
    id: "dawid-59",
    stepId: "dawid",
    path: "Nić przewodnia",
    passages: "2Sm 5,1-15",
  },
  {
    id: "dawid-60",
    stepId: "dawid",
    path: "Nić przewodnia",
    passages: "2Sm 7-8",
  },
  {
    id: "dawid-61",
    stepId: "dawid",
    path: "Nić przewodnia",
    passages: "2Sm 11,1-12,25",
  },
  {
    id: "dawid-62",
    stepId: "dawid",
    path: "Kręgosłup",
    passages: "1Sm 16-18",
  },
  {
    id: "dawid-63",
    stepId: "dawid",
    path: "Kręgosłup",
    passages: "1Sm 19-22",
  },
  {
    id: "dawid-64",
    stepId: "dawid",
    path: "Kręgosłup",
    passages: "1Sm 23-27",
  },
  {
    id: "dawid-65",
    stepId: "dawid",
    path: "Kręgosłup",
    passages: "1Sm 28-31",
  },
  {
    id: "dawid-66",
    stepId: "dawid",
    path: "Kręgosłup",
    passages: "2Sm 1-4",
  },
  {
    id: "dawid-67",
    stepId: "dawid",
    path: "Kręgosłup",
    passages: "2Sm 5-8",
  },
  {
    id: "dawid-68",
    stepId: "dawid",
    path: "Kręgosłup",
    passages: "2Sm 13-17",
  },
  {
    id: "dawid-69",
    stepId: "dawid",
    path: "Kręgosłup",
    passages: "2Sm 18-24",
  },
  {
    id: "salomon-70",
    stepId: "salomon",
    path: "Nić przewodnia",
    passages: "1Krl 2,1-12",
  },
  {
    id: "salomon-71",
    stepId: "salomon",
    path: "Nić przewodnia",
    passages: "1Krl 3,1-15",
  },
  {
    id: "salomon-72",
    stepId: "salomon",
    path: "Nić przewodnia",
    passages: "1Krl 5-7",
  },
  {
    id: "salomon-73",
    stepId: "salomon",
    path: "Nić przewodnia",
    passages: "1Krl 9,1-9",
  },
  {
    id: "salomon-74",
    stepId: "salomon",
    path: "Nić przewodnia",
    passages: "1Krl 11,1-13",
  },
  {
    id: "salomon-75",
    stepId: "salomon",
    path: "Kręgosłup",
    passages: "1Krl 1-5",
  },
  {
    id: "salomon-76",
    stepId: "salomon",
    path: "Kręgosłup",
    passages: "1Krl 6-11",
  },
  {
    id: "salomon-77",
    stepId: "salomon",
    path: "Kręgosłup",
    passages: "2Krn 1-4",
  },
  {
    id: "podział-i-upadek-północnego-królestwa-78",
    stepId: "podział-i-upadek-północnego-królestwa",
    path: "Nić przewodnia",
    passages: "1Krl 11,9-43",
  },
  {
    id: "podział-i-upadek-północnego-królestwa-79",
    stepId: "podział-i-upadek-północnego-królestwa",
    path: "Nić przewodnia",
    passages: "1Krl 12",
  },
  {
    id: "podział-i-upadek-północnego-królestwa-80",
    stepId: "podział-i-upadek-północnego-królestwa",
    path: "Nić przewodnia",
    passages: "2Krl 17,1-6",
  },
  {
    id: "podział-i-upadek-północnego-królestwa-81",
    stepId: "podział-i-upadek-północnego-królestwa",
    path: "Kręgosłup",
    passages: "1Krl 13,1-10",
  },
  {
    id: "podział-i-upadek-północnego-królestwa-82",
    stepId: "podział-i-upadek-północnego-królestwa",
    path: "Kręgosłup",
    passages: "1Krl 15,25-16,28",
  },
  {
    id: "podział-i-upadek-północnego-królestwa-83",
    stepId: "podział-i-upadek-północnego-królestwa",
    path: "Kręgosłup",
    passages: "2Krn 10-12",
  },
  {
    id: "podział-i-upadek-północnego-królestwa-84",
    stepId: "podział-i-upadek-północnego-królestwa",
    path: "Kręgosłup",
    passages: "2Krl 17",
  },
];

// {
//   id: "abraham-1",
//   stepId: "abraham",
//   path: Path.Thread,
//   passages: "Rdz 12-13",
// },
// {
//   id: "abraham-2",
//   stepId: "abraham",
//   path: Path.Thread,
//   passages: "Rdz 18, 1-15",
// },
// {
//   id: "abraham-3",
//   stepId: "abraham",
//   path: Path.Thread,
//   passages: "Rdz 21, 1-8",
// },
// {
//   id: "abraham-4",
//   stepId: "abraham",
//   path: Path.Spine,
//   passages: "Rdz 12-14",
// },
// {
//   id: "abraham-5",
//   stepId: "abraham",
//   path: Path.Spine,
//   passages: "Rdz 15-19",
// },
// {
//   id: "abraham-6",
//   stepId: "abraham",
//   path: Path.Spine,
//   passages: "Rdz 21-22",
// },
// {
//   id: "izaak-2",
//   stepId: "izaak",
//   path: Path.Thread,
//   passages: "Rdz 21, 1-8",
// },
// {
//   id: "izaak-3",
//   stepId: "izaak",
//   path: Path.Thread,
//   passages: "Rdz 25, 19-21",
// },
// {
//   id: "izaak-4",
//   stepId: "izaak",
//   path: Path.Spine,
//   passages: "Rdz 24",
// },
// {
//   id: "izaak-5",
//   stepId: "izaak",
//   path: Path.Spine,
//   passages: "Rdz 26, 1-35",
// },
// {
//   id: "izaak-6",
//   stepId: "izaak",
//   path: Path.Spine,
//   passages: "Rdz 35, 27-29",
// },

export async function populate() {
  await db.steps.bulkAdd(steps);
  await db.items.bulkAdd(items);
}
