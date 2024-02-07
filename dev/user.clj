(ns user
  (:require [babashka.http-client :as http]
            [cheshire.core :as json]
            [clojure.java.io :as io]
            [clojure.pprint :as pprint :refer [pprint]]
            [clojure.string :as str]
            [hyperfiddle.rcf :refer [tests]]))

(hyperfiddle.rcf/enable!)


;; write code to replace polish characters with english ones
(defn- polish-to-english [text]
  (-> text
      (str/replace "ą" "a")
      (str/replace "ć" "c")
      (str/replace "ę" "e")
      (str/replace "ł" "l")
      (str/replace "ś" "s")
      (str/replace "ń" "n")
      (str/replace "ó" "o")
      (str/replace "ż" "z")
      (str/replace "ź" "z")
      (str/replace "Ą" "A")
      (str/replace "Ć" "C")
      (str/replace "Ę" "E")
      (str/replace "Ł" "L")
      (str/replace "Ś" "S")
      (str/replace "Ń" "N")
      (str/replace "Ó" "O")
      (str/replace "Ż" "Z")
      (str/replace "Ź" "Z")))


(defn- polish-to-english-2 [text]
  (let [polish-chars {"ą" "a"
                      "ć" "c"
                      "ę" "e"
                      "ł" "l"
                      "ś" "s"
                      "ń" "n"
                      "ó" "o"
                      "ż" "z"
                      "ź" "z"
                      "Ą" "A"
                      "Ć" "C"
                      "Ę" "E"
                      "Ł" "L"
                      "Ś" "S"
                      "Ń" "N"
                      "Ó" "O"
                      "Ż" "Z"
                      "Ź" "Z"}]
    (->> text
         (map #(get polish-chars % %))
         (apply str))))

(comment
  (polish-to-english "aAąćęłśńóżźĄĆĘŁŚŃÓŻŹ"))


(defn- write-json [data file-path]
  (with-open [writer (io/writer file-path)]
    (json/generate-stream data writer)))


(defn- read-json [file-path]
  (with-open [reader (io/reader file-path)]
    (doall (json/parse-stream reader true))))

(def raw-book
  [[1 "Abraham" "Historia biblijna zaczyna się od Abrahama. Niezwykły człowiek wiary i modlitwy, pierwszy z patriarchów. Bezgranicznie zaufał Bogu, który niejednokrotnie do niego przemawiał. Sędziwy Abraham nazywany jest ojcem narodów."
    {:thread ["Rdz 12-13"
              "Rdz 18, 1-15"
              "Rdz 21, 1-8"]
     :spine ["Rdz 12-14"
             "Rdz 15-19"
             "Rdz 21-22"]}]

   [2 "Izaak"
    "Drugi patriarcha ludu Izraela. Syn Abrahama, spełnienie Bożej obietnicy. Pomimo, iż nie był jedynym, ani nawet pierwszym synem Abrahama został wybrańcem. Już na rok przed jego narodzeniem Pan zapowiedział, że to właśnie z Izaakiem zawrze swoje przymierze."
    {:thread ["Rdz 17,15-21"
              "Rdz 21,1-8"
              "Rdz 25,19-21"]
     :spine ["Rdz 24"
             "Rdz 26,1-35"
             "Rdz 35,27-29"]}]

   [3 "Jakub"
    "Młodszy z bliźniąt, które urodziły się Izaakowi. Chociaż błogosławieństwo swego ojca zdobył podstępem i walczył z Bożym aniołem, Pan obdarzył go licznym potomstwem i dał mu w posiadanie ziemie jego przodków, podtrzymując tym samym swoje przymierze."
    {:thread ["Rdz 25,21-34"
              "Rdz 28,1-22"
              "Rdz 32"]
     :spine ["Rdz 27-31"
             "Rdz 33-35"
             "Rdz 49-50"]}]

   [4 "Józef i bracia"
    "Jeden z 12 synów Jakuba. Umiłowany przez ojca stał się znienawidzony przez braci. Jego dar interpretacji snów uratował Egipcjan przed głodem a jemu samemu zapewnił godne stanowisko u boku Faraona. Tak Józef sprowadził ojca i braci do Egiptu."
    {:thread ["Rdz 37"
              "Rdz 39"
              "Rdz 41"
              "Rdz 47"]
     :spine ["Rdz 39-41"
             "Rdz 42-43"
             "Rdz 47-50"]}]

   [5 "Niewola, Wyjście z Egiptu, wędrówka do Kanaanu"
    "Od Księgi Wyjścia przez Księgę Kapłańską, Księgę Liczb i Powtórzonego Prawa poznajemy niezwykłą historię ludu Izraela, który Mojżesz wyprowadził z niewoli, który przyjął Boże prawo i doświadczył licznych cudów, który co chwilę buntował się przeciwko Bogu, to znowu nawracał, aż po 40 latach dotarł do Ziemi, o której słyszał tylko legendy."
    {:thread ["Wj 1,1-14"
              "Wj 3,1-15"
              "Wj 13-14"
              "Wj 19"
              "Wj 20,1-21"
              "Kpł 26"
              "Lb 13"]
     :spine ["Wj 5-8"
             "Wj 9-11"
             "Wj 12-15"
             "Wj 32-34"]}]
   [6 "Jozue"
    "Mężny i wierny Syn Nuna, urodzony jeszcze w niewoli egipskiej. Namaszczony przed śmiercią Mojżesza na jego następcę wypełnił Bożą obietnicę - wprowadził Izraelitów do Ziemi Obiecanej, podbił ją i osiedlił."
    {:thread ["Joz 1"
              "Joz 6,1-21"
              "Joz 21,43-45"]
     :spine ["Joz 1-4"
             "Joz 5-7"
             "Joz 8-11"
             "Joz 23-24"]}]

   [7 "Czasy Sędziów"
    "Okres, kiedy Izraelici osiedli Kanaan i musieli zmierzyć się z codziennością: rolnictwem, handlem, rzemiosłem. Sędziowie to nikt inny jak obdarzeni charyzmatem wybrańcy Boży, którzy czuwają nad bezpieczeństwem fizycznym, materialnym i religijnym Narodu."
    {:thread ["Sdz 1-2"
              "Sdz 3,7-31"]
     :spine ["Sdz 3-5"
             "Sdz 6-7"
             "Sdz 13-16"]}]

   [8 "Saul"
    "Pierwszy król Izraela, namaszczony na tę funkcję przez ostatniego z sędziów – Samuela. Przywódca, który zmierzył się z Filistynami i zjednoczył plemiona Izraela. Niestety głosu ludu lękał się bardziej niż głosu Boga, przez co przyszło mu wiele stracić…"
    {:thread ["1Sm 9,15-27"
              "1Sm 10,1-12"
              "1Sm 12"
              "1Sm 13"
              "1Sm 14,47-52"]
     :spine ["1Sm 7-12"
             "1Sm 14-16"
             "1Krn 10,1-14"]}]

   [9 "Dawid" "Był bardzo młody, kiedy został namaszczony na następcę Saula. Skromny i utalentowany pasterz przeszedł jednak długą, niebezpieczną drogę zanim cały lud Izraela uznał w nim króla. Pomimo błędów jakie popełniał, Bóg nie odwrócił się od niego, a lud miał w nim sprawiedliwego i walecznego władcę."
    {:thread ["1Sm 16, 1-13"
              "1Sm 17,32-58"
              "1Sm 18,5-16"
              "1Sm 24"
              "2Sm 5,1-15"
              "2Sm 7-8"
              "2Sm 11"
              "2Sm 12,1-25" 
              ]
     :spine ["1Sm 16-18"
             "1Sm 19-22"
             "1Sm 23-27"
             "1Sm 28-31"
             "2Sm 1-4"
             "2Sm 5-8"
             "2Sm 13-17"
             "2Sm 18-24"]}]
   [10 "Salomon"
    "„Proś o to, co mam ci dać” (1Krl 3,5-6) od tych słów zaczyna się pierwsza „rozmowa” Boga z Królem Salomonem. Od tej rozmowy Salomon staje się najroztropniejszym władcą Izraela, a wraz z mądrością, o którą tak skromnie prosił otrzymuje od Pana niezliczone bogactwo i potęgę."
    {:thread ["1Krl 2,1-12"
              "1Krl 3,1-15"
              "1Krl 5-7"
              "1Krl 9,1-9"
              "1Krl 11,1-13"]
     :spine ["1Krl 1-5"
             "1Krl 6-11"
             "2Krn 1-4"]}]

   [11 "Podział i upadek północnego królestwa"
    "Miasta bogaciły się i rozrastały. Już w chwili śmierci Salomona widać było, że rozwój materialny destrukcyjnie wpływał na rozwój duchowy. W Izraelu na dobre rozgościł się politeizm, zapominano o przymierzu. Tak jak zapowiedział Bóg Salomonowi doszło do buntu a podział królestwa stał się faktem."
    {:thread ["1Krl 11,9-43"
              "1Krl 12"
              "2Krl 17,1-6"]
     :spine ["1Krl 13,1-10"
             "1Krl 15,25-34"
             "1Krl 16,1-28"
             "2Krn 10-12"
             "2Krl 17"]}]

   [12 "Eliasz"
    "Zapisał się jako najpotężniejszy z proroków.
 Jego misją było nawrócenie ludu Izraela, tak
 aby na nowo uznał, że Pan jest jedynym
 Bogiem. Później oczekiwano powrotu Eliasza
 który, miał poprzedzić przyjście Mesjasza."
    {:thread ["1Krl 18,1-40"
              "2Krl 2,1-11"]
     :spine ["1Krl 17-19"
             "1Krl 20-22"
             "2Krl 1,1-2"
             "2Krl 18"
             "Syr 48,1-1"
             "Mt 17,1-13"]}]

   [13 "Elizeusz"
    "Zgodnie z wolą Pana został następcą proroka
 Eliasza. Był jego uczniem i wieloletnim sługą,
 przez co zapewne pozostawał pod silnym jego
 wpływem. Zasłynął z licznych cudów i
 uzdrowień jakich dokonał wśród ludu."
    {:thread ["1Krl 19"
              "2Krl 2"
              "2Krl 5,1-27"]
     :spine ["2Krl 2-5"
             "2Krl 6-8"
             "2Krl 9-13"]}]

   [14 "Upadek Judy i niewola babilońska"
    "Po podziale zjednoczonego królestwa Izraela Judea nie miała szczęścia do władców naprzemiennie niszczyli kult bożków, to znowu go przywracali. Finalnie kres istnieniu państwa położył najazd Nabuchodonozora II na Jerozolimę i przesiedlenie Żydów."
    {:thread ["2Krl 18,1-8"
              "2Krl 21,1-23"
              "2Krl 22-24"
              "2Krl 25,1-21" 
              ]
     :spine ["2Krl 18-21"
             "2Krl 22-25"
             "2Krn 10-12"
             "2Krn 13-16"
             "2Krn 17-20"
             "2Krn 21-24"]}]

   [15 "Izajasz"
    "Prorok-wychowawca, który gorliwie zabiegał o monoteizm wśród Izraela. Przepowiadał przyjście Mesjasza. Dysponował doskonałym warsztatem pisarskim, toteż pozostawił pokaźną spuściznę literacką, na kanwie której powstała księga Izajasza (uzupełniona o późniejszych autorów wzorujących się na nauczaniu proroka)."
    {:thread ["Iz 6"
              "Iz 11-12"
              "Iz 24-27"]
     :spine ["Iz 1-4"
             "Iz 5-9"
             "Iz 10-12"
             "Iz 28-30"
             "Iz 40-44"
             "Iz 45-49"
             "Iz 50-55"
             "2Krl 19-20"]}]

   [16 "Jeremiasz" "Za życia proroka doszło do zniszczenia Jerozolimy, kiedy to naród wybrany popadł w niewolę babilońską. Jego posługa nie była więc prosta. Finalnie Jeremiasz przyczynił się do podtrzymania religijności Izraelitów w czasie ucisku oraz ukształtowania jej na nowo po powrocie do kraju."
    {:thread ["Jr 1"
              "Jr 36-38"
              "Jr 39-45"]
     :spine ["Jr 1-4"
             "Jr 5-7"
             "Jr 21-25"
             "Jr 26-31"
             "2Krn 25-27"
             "2Krn 28-31"
             "2Krn 32-36"]}]

   [17 "Prorocy mniejsi"
    "Przed nami szereg mów prorockich z bardzo
 różnych okresów, zebranych w 12 ksiąg, z
 których każda opatrzona jest imieniem
 proroka. Nazwa „mniejsi” nie jest wynikiem
 tego, że ich działalność oceniono na gorszą od
 działalności „większych” (Iz, Jr, Ez, Dn).
 Księgi te są po prostu znacznie krótsze, od
 dotychczasowych dzieł. Na uwagę zasługują
 proroctwa „pocieszające” z wyraźnymi
 akcentami mesjańskimi."
    {:thread ["Mi 5,1-7"
              "Ag 1-2"]
     :spine ["Oz 1-3"
             "Oz 4-9"
             "Oz 10-14"
             "Jl 1-2"
             "Jl 3-4"
             "Am 1-9"
             "Mi 1-7"
             "Na 1-3"
             "Za 1-4"]}]
   [18 "Ezechiel"
    "Ezechiel to prorok, który swoją misję
 wypełniał na wygnaniu. Wyznaczony został na
 stróża nad Izraelem, przez co starał się
 uzmysłowić współbraciom, że odstępstwo od
 Boga i fałszywi prorocy są przyczyną ich
 nieszczęścia. Wzywał do refleksji i pokuty."
    {:thread ["Ez 10-13"
              "Ez 14-16"
              "Ez 18"]
     :spine ["Ez 33-37"
             "Ez 40"]}]
   [19 "Daniel"
    "Zamyka grupę ksiąg Proroków większych. W
 czasie niewoli przebywał na dworze
 królewskim: babilońskim a później perskim.
 Prorok miał dar przepowiadania snów,
 doświadczał licznych wizji a nawet
 cudownego ocalenia. Na szczególną uwagę
 zasługuje jego proroctwo opisujące postać
 'Syna Człowieczego'."
    {:thread ["Dn 1"
              "Dn 6"
              "Dn 7,9-14"]
     :spine ["Dn 3-5"
             "Dn 7"
             "Dn 9"
             "Dn 13"]}]

   [20 "Powrót z niewoli babilońskiej i odbudowa świątyni Jerozolimskiej (Zorobabela)"
    "Po około 60 latach niewoli i tułaczki, na mocy
 dekretu króla perskiego Cyrusa II Izraelici
 mogli powrócić do ojczyzny. Repatrianci
 musieli zmierzyć się z odbudową Judy i
 Jerozolimy wraz ze zrujnowaną Świątynią
 oraz niezwykle trudną odnową moralną i
 religijną."
    {:thread ["Ezd 1"
              "Ezd 3"
              "Ezd 7-10"]
     :spine ["Ne 1-4"
             "Ne 5-7"
             "Ne 8-10"]}]

   [21 "Czasy Machabeuszów"
    "„Machabeusze” to przydomek rodu
 kapłańskiego, który poprowadził powstanie i
 bunt przeciwko rządom kolejnych cywilizacji
 na ziemiach żydowskich. Izraelici mieli dość
 niszczenia ich dobytku i bezczeszczenia
 świątyni a czarę goryczy przelała próba
 zhellenizowania ich przez Greków."
    {:thread ["1Mch 1"
              "1Mch 2-3"
              "1Mch 4,36-61"
              "2Mch 7"]
     :spine ["2Mch 1-2"
             "2Mch 3-5"
             "2Mch 6-7"
             "2Mch 8-10"
             "2Mch 11-13"
             "2Mch 14-15"]}]

   [22 "Księga Psalmów"
    "Księga zawiera 150 utworów. Ich piękno
 wynika ze zróżnicowanej struktury literackiej
 (psalmy, hymny, lamentacje, proroctwa itd.)
 i teologicznej (od stworzenia świata po
 mesjaństwo Chrystusa). To niezwykle cenny
 zbiór będący dowodem na głęboką religijność
 Izraela."
    {:thread ["Ps 1"
              "Ps 23"
              "Ps 42"
              "Ps 98"]
     :spine ["Ps 2"
             "Ps 22"
             "Ps 51"
             "Ps 150"]}]

   [23 "Księga Przysłów"
    "Mądrość była w Izraelu przymiotem
 szczególnym, dlatego literatura mądrościowa
 stanowiła uprzywilejowany rodzaj literacki. W
 Księdze Przysłów zebrano napomnienia,
 pouczenia moralne i religijne, które stanowiły
 sumę prawd życiowych. Cnotą wiodącą była
 bogobojność."
    {:thread ["Prz 1"
              "Prz 6-7"]
     :spine ["Prz 2-3"
             "Prz 23-27"]}]

   [24 "Księgi Mądrości"
    "Zarówno Księga Mądrości jak i Mądrość
 Syracha wpisują się w nurt ksiąg
 dydaktycznych. Autorzy zachęcają do
 poszukiwania mądrości i wcielania jej w życie.
 Pojawia się również nauka o uosobionej
 Mądrości Bożej, z której czerpali autorzy
 Nowego Testamentu."
    {:thread ["Mdr 1-3"
              "Syr 1-5"]
     :spine ["Mdr 9-11"
             "Syr 35-37"]}]

   [25 "Stworzenie, upadek i przymierze"
    "Na pierwszych kartach księgi Genesis spisane
 zostały etapy dziejów ludzkości od
 stworzenia świata, przez grzech pierwszych
 ludzi, bratobójstwo, potop aż do pierwszego
 przymierza z Bogiem. To nie jest historia
 w naszym rozumieniu tego słowa (stąd takie
 a nie inne miejsce w tym przewodniku).
 Czytając kolejne rozdziały poznajemy naturę
 człowieka oraz obserwujemy, jak rodziła się
 i rozwijała jego relacja ze Stwórcą."
    {:thread ["Rdz 1"
              "Rdz 2,1-4"
              "Rdz 3"]
     :spine ["Rdz 1-3"
             "Rdz 4,1-16"
             "Rdz 5"
             "Rdz 6,1-4"
             "Rdz 6,5-22"
             "Rdz 7-8"
             "Rdz 9,1-17"
             "Rdz 9,18-1"]}]

   [26 "Jan Chrzciciel i Narodziny Jezusa"
    "Archanioł Gabriel dwukrotnie zwiastował
 narodzenie: najpierw Jana, potem Jezusa.
 Ostatni prorok - Jan rodzi się około pół roku
 przed Chrystusem i przygotowuje ludzi na
 Jego bezpośrednie przyjście. Od momentu
 narodzenia ich drogi będą prowadziły nad
 Jordan, gdzie Jezus przyjmie chrzest od Jana.
 Tym wydarzeniem jeden będzie kończył
 swoją misję, a drugi dopiero ją zaczynał…"
    {:thread ["Łk 1,5-25"
              "Łk 1,57-80"
              "Łk 3,1-22"
              "Mt 11,2-19"
              "Mt 14,1-12"
              "Mt 1,1-25"
              "Łk 2,1-21"
              "J 1,1-18"]
     :spine ["Łk 1-3"
             "Mt 1-3"
             "Mk 1,1-14"
             "J 3,22-36"]}]

   [27 "Nauczanie Jezusa"
    "Mesjasz, Prorok, Syn Człowieczy, Zbawiciel –
 tak Jezus tytułuje się na kartach Ewangelii.
 Przyszedł głosić Królestwo Bożego oraz
 „odszukać i zbawić to, co zaginęło”. (Łk 19, 10)"
    {:thread ["Mt 5-7"
              "Mt 13"
              "Mt 16,13-28"
              "Mt 17,1-13"
              "Mt 22,34-40"
              "Łk 18,1-17"
              "Mk 13,24-37"
              "J 8,12-59"
              "J 10,1-39"
              "J 14-16"]
     :spine ["Mt 5-8"
             "Mt 10-13"
             "Mt 16-18"
             "Mt 19-20"
             "Mt 21-23"
             "Mt 24-25"
             "Mk 9-10"
             "Mk 11-13"
             "Łk 9,51-62"
             "Łk 10-13"
             "Łk 14-17"
             "Łk 18-21"
             "J 3-4"
             "J 7-8"
             "J 12-16"]}]

   [28 "Cuda Jezusa"
    "Zamiana wody w wino, uciszenie burzy na
 jeziorze, wskrzeszenia, uzdrowienia,
 egzorcyzmy takie znaki czynił Jezus wśród
 ludzi. Cuda są dopełnieniem nauki, którą
 głosił. Niosą również ważne przesłanie o Nim
 samym: źródłem takiej mocy nie może być
 tylko człowiek."
    {:thread ["J 2,1-12"
              "J 11,1-44"
              "Mt 14,13-36"
              "J 6,16-21"
              "Łk 8,22-56"]
     :spine ["J 5-6"
             "J 9"
             "Mt 15,21-39"
             "Mt 17,14-2"
             "Mt 8-9"]}]
   [29 "Męka i Zmartwychwstanie"
    "„spełni się wszystko, co napisali prorocy o
 Synu Człowieczym. Zostanie wydany w ręce
 pogan, będzie wyszydzony, zelżony i opluty;
 ubiczują Go i zabiją, a trzeciego dnia
 zmartwychwstanie.” (Łk 18, 31-33)"
    {:thread ["Łk 18,31-34"
              "J 11,45-57"
              "J 18-20"]
     :spine ["Mt 26-28"
             "Mk 14-16"
             "Łk 22-24"
             "J 12-21"]}]


   [30 "Dzieje Apostolskie"
    "Ewangelista Łukasz opisuje czas po
 wniebowstąpieniu Jezusa. Z kart księgi
 dowiadujemy się jak po otrzymaniu daru
 Ducha Świętego apostołowie (szczególnie św.
 Piotr i św. Paweł) realizują powierzoną im
 misję: głoszenia Dobrej Nowiny „(…) w
 Jerozolimie i całej Judei, i w Samarii, i aż po
 krańce ziemi.”"
    {:thread ["Dz 2-3"
              "Dz 9-11"
              "Dz 12-13"] :spine ["Dz 1-3"
                                  "Dz 4-9"
                                  "Dz 15-17"
                                  "Dz 18-21"
                                  "Dz 22-24"
                                  "Dz 15-28"
                                  "Dz 25-28"]}]

   [31 "Listy św. Pawła"
    "Listy są zupełnie nowym gatunkiem
 literackim. Apostoł Paweł kieruje je do
 wspólnot, które wcześniej ewangelizował. 13
 pism zawiera naukę, która jest odpowiedzią
 na ówczesne problemy kształtującego się
 Kościoła. Apostoł Narodów przybliża
 wspólnotom w poszczególnych miastach
 naukę Zmartwychwstałego."
    {:thread ["Rz 1"
              "Rz 8"
              "Rz 12,1-21"
              "Rz 13-14"
              "Rz 15,1-13"
              "1Kor 12-13"
              "1Kor 14-16"
              "Ga 1-2"
              "Ga 3-6"
              "Kol 1-2"
              "Kol 3-4"
              "2Tes 1"
              "2Tes 2-3"]
     :spine ["2Kor 1-4"
             "2Kor 5-7"
             "2Kor 8-13"
             "Ef 1-3"
             "Ef 4-6"
             "Flp 1-2"
             "Flp 3-4"
             "1Tes 1-2"
             "1Tes 3-5"
             "1Tym 1-3"
             "1Tym 4-6"
             "2Tym 1-2"
             "2Tym 3-4"]}]

   [32 "Listy innych Apostołów"
    "Pozostali Apostołowie, podobnie do św. Pawła
 również kierowali swoje słowo do nowo
 zawiązanych gmin chrześcijańskich. W swoich
 listach udzielali im wskazówek, napomnień
 oraz opisywali wzorce postępowań."
    {:thread ["Hbr 1-3"
              "Hbr 10-13"
              "1J 1-2"
              "1J 3-5"]
     :spine ["Hbr 1-3"
             "Hbr 4-6"
             "Hbr 7-9"
             "Hbr 10-13"
             "Jk 1-2"
             "Jk 3-5"
             "1P 1-2"
             "1P 3-5"]}]

   [33 "Apokalipsa św. Jana"
    "Najtrudniejsza z ksiąg Nowego Testamentu.
 Dzieło wizjonerskie, przepełnione
 różnorakimi motywami i rozbudowaną
 symboliką. Sędziwy Jan napisał to proroctwo
 z myślą o chrześcijanach w Azji Mniejszej,
 którzy doświadczali licznych prześladowań.
 Proroctwo opisując triumf Kościoła przy
 końcu czasów oraz powtórne przyjście
 Chrystusa miało utwierdzać w wierze i
 podtrzymywać na duchu."
    {:thread ["Ap 1-3"
              "Ap 4-5"
              "Ap 14,1-13"
              "Ap 15,1-4"
              "Ap 21-22"]
     :spine ["Ap 6-9"
             "Ap 10-13"
             "Ap 14-16"
             "Ap 17-22"]}]])

(def raw-step-schema
  [:tuple
   string? ; step: string
   string? ; description: string
   [:map ; two path of reading tasks
    [:thread [:vector string?]] ; :thread key with a vector of strings
    [:spine [:vector string?]]]]) ; :spine key with a vector of strings



(defn- create-step [[id title intro]]
  {:id id
   :title title
   :introduction intro})

(defn- reading-task [step-id path-type counter passage]
  {:id (str (swap! counter inc) "-" step-id )
   :stepId step-id
   :path path-type
   :passages passage})

(defn- create-reading-tasks [step-id passages path-type counter]
  (let [mapper (partial reading-task step-id path-type counter)]
    (mapv mapper passages)));

;; example of book-raw input is a vector of vectors having following shape shape: 
;;
;; [ step description {:thread [passage1 ...] :spin [passage1 ...]}]
;; 
;; so there are two passage sets, one is so called a thread and another is a spin 
;; ["Abraham"
;;  "Historia biblijna zaczyna się od Abrahama..."
;;  {:thread ["Rdz 12-13"
;;            "Rdz 18, 1-15"
;;            "Rdz 21, 1-8"]
;;   :spine ["Rdz 12-14"
;;           "Rdz 15-19"
;;           "Rdz 21-22"]}]

;; example output of parse-book-input
;; {:steps
;;     [{:id "apokalipsa-św.-jana",
;;       :title "Apokalipsa św. Jana",
;;       :introduction "Najtrudniejsza z ksiąg Nowego Testamentu.\n Dzieło wizjonerskie, ..."}]
;;  :items [{:id "abraham-2",
;;           :stepId "abraham",
;;           :path "Nić przewodnia",
;;           :passages "Rdz 12-13"}]})

(defn- parse-book [raw]
  (let [steps (mapv create-step raw)
        counter (atom 1)
        items (mapcat (fn [[id _ _ {:keys [thread spine]}]]
                        (let [step-id id]
                          (concat (create-reading-tasks step-id thread "Nić przewodnia" counter)
                                  (create-reading-tasks step-id spine "Kręgosłup" counter))))
                      raw)]
    {:steps steps :items (into [] items)}))

(comment
  (pprint/pprint (parse-book raw-book))
  :end)

(tests
 "parse raw data"
 (parse-book
  [[1 "Abraham"
    "Historia biblijna zaczyna się od Abrahama..."
    {:thread ["Rdz 12-13"
              "Rdz 21, 1-8"]
     :spine ["Rdz 12-14"
             "Rdz 21-22"]}]])
 :=
 {:steps
  [{:id 1,
    :title "Abraham",
    :introduction "Historia biblijna zaczyna się od Abrahama..."}]
  :items
  [{:id "2-1",
    :stepId 1,
    :path "Nić przewodnia",
    :passages "Rdz 12-13"}
   {:id "3-1",
    :stepId 1,
    :path "Nić przewodnia",
    :passages "Rdz 21, 1-8"}
   {:id "4-1",
    :stepId 1,
    :path "Kręgosłup",
    :passages "Rdz 12-14"}
   {:id "5-1",
    :stepId 1,
    :path "Kręgosłup",
    :passages "Rdz 21-22"}]})


(comment
  (let [parsed-data (parse-book raw-book)
        json-file-path "biblical_passages.json"]
    (write-json parsed-data json-file-path)
    (println "File saved to" json-file-path))
  :end)


(defn- unfold-range [[from to]]
  (let [from (Integer/parseInt from)
        to (when to (Integer/parseInt to))]
    (if (nil? to)
      [from]
      (into [] (range from (inc to))))))


;; extract from passages "Rdz 12-14" :book "Rdz" :chapters [12 13 14]
(defn- extract-passages [passage]
  (let
   [passage-parts (str/split passage #" ")]
    {:book (first passage-parts)
     :chapters (let [chapter-and-verses (second passage-parts)
                     [chapter verses] (str/split chapter-and-verses #",")]
                 (if (nil? verses)
                   (->
                    (str/split chapter #"-")
                    (unfold-range))
                   [{:chapter (Integer/parseInt chapter) :verses (unfold-range (str/split verses #"-"))}]))}))



(tests
 "Just single chapter"
 (extract-passages "Rdz 12") := {:book "Rdz", :chapters [12]}
 "A range of chapters"
 (extract-passages "Rdz 13-18") := {:book "Rdz", :chapters [13 14 15 16 17 18]}
 "A range of verses"
 (extract-passages "Rdz 13,1-18") := {:book "Rdz", :chapters [{:chapter 13, :verses [1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18]}]})

(comment
  (pprint/pprint
   (->> (parse-book raw-book)
        :items
        (map :passages)
        (map extract-passages)))
  :end)

  ;; {:bible {:abbreviation "bt", :name "Biblia Tysiąclecia"},
  ;; :book {:abbreviation "rdz", :name "Księga Rodzaju"},
  ;; :chapter 12,
  ;; :type "Wersety",
  ;; :verses
  ;; [{:text
  ;;   "Pan rzekł do Abrama: Wyjdź z twojej ziemi rodzinnej i z domu twego ojca do kraju,  który ci ukażę.",
  ;;   :verse "1"}
  ;;  {:text
  ;;   "Uczynię bowiem z ciebie wielki naród,  będę ci błogosławił i twoje imię rozsławię: staniesz się błogosławieństwem.",
  ;;   :verse "2"}
  ;;  {:text
  ;;   "Będę błogosławił tym,  którzy ciebie błogosławić będą,  a tym,  którzy tobie będą złorzeczyli,  i ja będę złorzeczył. Przez ciebie będą otrzymywały błogosławieństwo ludy całej ziemi.",
  ;;   :verse "3"}],
  ;; :verses_range "1-20"})
(defn- fetch-whole-chapter
  "Return the whole chapter (all verses) structure
   
   Params:
     book: str = book code like Rdz, Mt 
     chapter: str - integer number '1'
   "
  [book chapter]

  (let [url (str "https://www.biblia.info.pl/api/biblia/bt/" book "/" chapter)]
    (println "Fetching" url)
    (->
     (http/get url)
     :body
     (json/parse-string true))))

(comment
  (def chapter (fetch-whole-chapter "Kpl" "1"))
  (pprint chapter)
  (-> chapter :verses)
  :end)

(defn fetch-passage-text!
  [passage]
  (let [book (polish-to-english (passage :book))
        chapters (passage :chapters)]
    (->> chapters
         (map (fn [chapter]
                (fetch-whole-chapter book
                                     (if (int? chapter)
                                       (str chapter)
                                       (:chapter chapter))))))))

(comment
  (pprint/pprint (fetch-passage-text! {:book "Rdz" :chapters [12]}))
  (pprint/pprint (fetch-passage-text! {:book "Rdz" :chapters [12 13]}))
  (pprint/pprint (fetch-passage-text! {:book "Rdz", :chapters [{:chapter 13, :verses [1 2]}]})))


(defn valid-verse? [s]
  (re-matches #"\d+([ab])?$" s))

(defn verse-with-char? [verse]
  (re-matches #"\d+[ab]+?$" verse))

(defn isB? [verse]
  (re-matches #"\d+[b]+?$" verse))

(defn split-verse-with-char [verse-number]
  (let [[_ num char] (re-find #"(\d+)([a-zA-Z])" verse-number)]
    [(Integer/parseInt num),  char]))

(comment

  (valid-verse? "22b") ;=> true
  (valid-verse? "22")  ;=> true
  (valid-verse? "22a") ;=> true
  (valid-verse? "22c") ;=> false 
  (verse-with-char? "22a")
  (verse-with-char? "22")

  (isB? "12b")
  (isB? "12a")


 (split-verse-with-char "12a")
 (split-verse-with-char "22b")
 :end)


(defn calculate-verse-nr-when-a-first [verse-nr]
  (+ (- verse-nr 1) (/ verse-nr 100)))

(defn calculate-verse-nr-when-a-next [verse-nr prev-verse]
  (+ (int prev-verse) (/ verse-nr 100)))

(comment
  (calculate-verse-nr-when-a-first 10)
  (calculate-verse-nr-when-a-first 9) 
  (calculate-verse-nr-when-a-next 10 809/100)

  (type 81/10)
  )

(defn calculate-verse-nr [{:keys [verse prev-verse]}]
  (if (verse-with-char? verse)
    (let [[verse-nr _] (split-verse-with-char verse)]
      (cond
        (isB? verse) {:verse verse-nr :verseStr verse}
        (or (not (nil? prev-verse)) (instance? clojure.lang.Ratio prev-verse)) {:verse (calculate-verse-nr-when-a-next verse-nr prev-verse) :verseStr verse} ;;
        :else {:verse  (calculate-verse-nr-when-a-first verse-nr) :verseStr verse}))
    {:verse (Integer/parseInt verse) :verseStr verse}))


(tests
 "Starting case"
 (calculate-verse-nr {:verse "1a" :prev-verse nil}) := {:verse 1/100 :verseStr "1a"}
 "Simple passage 10"
 (calculate-verse-nr {:verse "10" :prev-verse (Integer/parseInt "9")}) := {:verse 10 :verseStr "10"}
 "Passage 10b, should be 10"
 (calculate-verse-nr {:verse "10b" :prev-verse (Integer/parseInt "9")}) := {:verse 10 :verseStr "10b"}
 "Passage 10a, when first in series, should be 9.1 (91/10)"
 (calculate-verse-nr {:verse "10a" :prev-verse (Integer/parseInt "9")}) := {:verse 91/10 :verseStr "10a"}
 "Passage 10a, when second in series, should be 8 (81/10)"
 (calculate-verse-nr {:verse "10a" :prev-verse 809/100}) := {:verse 81/10 :verseStr "10a"})




(comment
  (def a 10.12)
  (type a)
  (def input [{:verse "10"} {:verse "11a"} {:verse "12a"} {:verse "11b"} {:verse "12b"} {:verse 13}])
  (def output
    [{:verse 10 :verseStr "10"}
     {:verse 10.11 :verseStr "11a"}
     {:verse 10.12 :verseStr "12a"}
     {:verse 11 :verseStr "11b"}
     {:verse 12 :verseStr "12b"}])

  (last (conj [:a] :b)))



;;  {:bookAbbr (get-in item [:book :abbreviation])
;; ;;  :chapter (get-in item [:chapter])
;;  (mapv (fn [verse]
;;            {:bookAbbr (get-in item [:book :abbreviation])
;;             :chapter (get-in item [:chapter])
;;             :verse (Integer/parseInt (verse :verse))
;;             :text (verse :text)}) (get-in item [:verses]))})



(defn calc-verse-reducer [acc val]
  (let [{:keys [verse verseStr]} (calculate-verse-nr {:verse (str (:verse val)) :prev-verse (:verse (last acc))})]
    (conj acc {:verse verse
               :verseStr verseStr
               :text (val :text)})))

(fetch-whole-chapter "Ga" "1")

(defn remap-book [bookAbbr]
  (let [abbr (str/lower-case bookAbbr)
        mapping {"mat" "mt"
                 "luk" "lk"
                 "jan" "j" 
                 "mar" "mk"
                 "obj" "ap" 
                 "gal" "ga"
                 "hebr" "hbr"
                 "jak" "jk"
                 "fil" "flp"
                 }
        mapped (get mapping abbr)]
    (or mapped abbr)))

(defn- to-book-verse [item]
  {:bibleAbbr (get-in item [:bible :abbreviation])
   :bibleName (get-in item [:bible :name])
   :bookAbbr (remap-book (get-in item [:book :abbreviation]))
   :bookName (get-in item [:book :name])
   :chapter (get-in item [:chapter])
   :verses
   (->>
    (filter (fn [v] (valid-verse? (:verse v))) (get-in item [:verses]))
    (reduce calc-verse-reducer [])
    (map (fn [v] (assoc v :bookAbbr (remap-book (get-in item [:book :abbreviation]))
                        :chapter (get-in item [:chapter])))))})


(defn fetch-bible-passages!
  "Take the raw book text, extract passages, fetch passages text from the api"
  [raw-book]
  (->> (parse-book raw-book)
       :items
       (mapv :passages)
       (mapv extract-passages)
       (mapv fetch-passage-text!)
       (flatten)
       (mapv to-book-verse)
       (mapv :verses)
       (reduce concat)
       (into [])))

(defn distinct-by [f coll]
  (let [groups (group-by f coll)]
    (map #(first (groups %)) (distinct (map f coll)))))

(comment


  (fetch-bible-passages!  [["Abraham"
                            "Historia biblijna zaczyna się od Abrahama..."
                            {:thread ["Rdz 12-13"
                                      "Rdz 21, 1-8"]
                             :spine ["Rdz 12-14"
                                     "Rdz 21-22"]}]])


  (def all-verses (fetch-bible-passages! raw-book))
  (write-json all-verses "all-verses.json")
  (let [with-dupl
        (->>
         (read-json "all-verses.json")
         (map (fn [v] (assoc v :ident (str (:verse v) (:bookAbbr v) (:chapter v))))))
        unique-coll (distinct-by (fn [v] (:ident v)) with-dupl)
        clean-coll (mapv (fn [v] (dissoc v :ident)) unique-coll)
        ]
    (write-json clean-coll "all-verses-unique.json"))
  :end
  )


;; (defn- to-verses [book]
;;   (->> book
;;        :verses
;;        (map (fn [verse]
;;               {:verse (Integer/parseInt (verse :verse))
;;                :text (verse :text)}))))

;; (defn- chapter-2-verse-view
;;   "Return vec containing all flatten verses from given part of the bible "
;;   [bible]
;;   (->> bible
;;        (mapv to-book-verse)
;;        (mapv :verses)
;;        (reduce concat)
;;        (into [])))
