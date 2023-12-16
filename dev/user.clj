(ns user
  (:require [clojure.java.io :as io]
            [clojure.string :as str]
            [cheshire.core :as json]))

(def input-data
  [["Abraham" "Historia biblijna zaczyna się od Abrahama. Niezwykły człowiek wiary i modlitwy, pierwszy z patriarchów. Bezgranicznie zaufał Bogu, który niejednokrotnie do niego przemawiał. Sędziwy Abraham nazywany jest ojcem narodów."
    {:thread ["Rdz 12-13"
              "Rdz 18, 1-15"
              "Rdz 21, 1-8"]
     :spine ["Rdz 12-14"
             "Rdz 15-19"
             "Rdz 21-22"]}]

   ["Izaak"
    "Drugi patriarcha ludu Izraela. Syn Abrahama, spełnienie Bożej obietnicy. Pomimo, iż nie był jedynym, ani nawet pierwszym synem Abrahama został wybrańcem. Już na rok przed jego narodzeniem Pan zapowiedział, że to właśnie z Izaakiem zawrze swoje przymierze."
    {:thread ["Rdz 17,15-21"
              "Rdz 21,1-8"
              "Rdz 25,19-21"]
     :spine ["Rdz 24"
             "Rdz 26,1-35"
             "Rdz 35,27-29"]}]

   ["Jakub"
    "Młodszy z bliźniąt, które urodziły się Izaakowi. Chociaż błogosławieństwo swego ojca zdobył podstępem i walczył z Bożym aniołem, Pan obdarzył go licznym potomstwem i dał mu w posiadanie ziemie jego przodków, podtrzymując tym samym swoje przymierze."
    {:thread ["Rdz 25,21-34"
              "Rdz 28,1-22"
              "Rdz 32"]
     :spine ["Rdz 27-31"
             "Rdz 33-35"
             "Rdz 49-50"]}]

   ["Józef i bracia"
    "Jeden z 12 synów Jakuba. Umiłowany przez ojca stał się znienawidzony przez braci. Jego dar interpretacji snów uratował Egipcjan przed głodem a jemu samemu zapewnił godne stanowisko u boku Faraona. Tak Józef sprowadził ojca i braci do Egiptu."
    {:thread ["Rdz 37"
              "Rdz 39"
              "Rdz 41"
              "Rdz 47"]
     :spine ["Rdz 39-41"
             "Rdz 42-43"
             "Rdz 47-50"]}]

   ["Niewola, Wyjście z Egiptu, wędrówka do Kanaanu"
    "Od Księgi Wyjścia przez Księgę Kapłańską, Księgę Liczb i Powtórzonego Prawa poznajemy niezwykłą historię ludu Izraela, który Mojżesz wyprowadził z niewoli, który przyjął Boże prawo i doświadczył licznych cudów, który co chwilę buntował się przeciwko Bogu, to znowu nawracał, aż po 40 latach dotarł do Ziemi, o której słyszał tylko legendy."
    {:thread ["Wj 1,1-14"
              "Wj 3,1-15"
              "Wj 13-14"
              "Wj 19,1-20,21"
              "Kpł 26"
              "Lb 13"]
     :spine ["Wj 5-8"
             "Wj 9-11"
             "Wj 12-15"
             "Wj 32-34"]}]
   ["Jozue"
    "Mężny i wierny Syn Nuna, urodzony jeszcze w niewoli egipskiej. Namaszczony przed śmiercią Mojżesza na jego następcę wypełnił Bożą obietnicę - wprowadził Izraelitów do Ziemi Obiecanej, podbił ją i osiedlił."
    {:thread ["Joz 1"
              "Joz 6,1-21"
              "Joz 21, 43-45"]
     :spine ["Joz 1-4"
             "Joz 5-7"
             "Joz 8-11"
             "Joz 23-24"]}]

   ["Czasy Sędziów"
    "Okres, kiedy Izraelici osiedli Kanaan i musieli zmierzyć się z codziennością: rolnictwem, handlem, rzemiosłem. Sędziowie to nikt inny jak obdarzeni charyzmatem wybrańcy Boży, którzy czuwają nad bezpieczeństwem fizycznym, materialnym i religijnym Narodu."
    {:thread ["Sdz 1-2"
              "Sdz 3,7-31"]
     :spine ["Sdz 3-5"
             "Sdz 6-7"
             "Sdz 13-16"]}]

   ["Saul"
    "Pierwszy król Izraela, namaszczony na tę funkcję przez ostatniego z sędziów – Samuela. Przywódca, który zmierzył się z Filistynami i zjednoczył plemiona Izraela. Niestety głosu ludu lękał się bardziej niż głosu Boga, przez co przyszło mu wiele stracić…"
    {:thread ["1Sm 9,15-10,12"
              "1Sm 13"
              "1Sm 14,47-52"]
     :spine ["1Sm 7-12"
             "1Sm 14-16"
             "1Krn 10,1-14"]}]

   ["Dawid" "Był bardzo młody, kiedy został namaszczony na następcę Saula. Skromny i utalentowany pasterz przeszedł jednak długą, niebezpieczną drogę zanim cały lud Izraela uznał w nim króla. Pomimo błędów jakie popełniał, Bóg nie odwrócił się od niego, a lud miał w nim sprawiedliwego i walecznego władcę."
    {:thread ["1Sm 16, 1-13"
              "1Sm 17,32-58"
              "1Sm 18,5-16"
              "1Sm 24"
              "2Sm 5,1-15"
              "2Sm 7-8"
              "2Sm 11,1-12,25"]
     :spine ["1Sm 16-18"
             "1Sm 19-22"
             "1Sm 23-27"
             "1Sm 28-31"
             "2Sm 1-4"
             "2Sm 5-8"
             "2Sm 13-17"
             "2Sm 18-24"]}]
   ["Salomon"
    "„Proś o to, co mam ci dać” (1Krl 3,5-6) od tych słów zaczyna się pierwsza „rozmowa” Boga z Królem Salomonem. Od tej rozmowy Salomon staje się najroztropniejszym władcą Izraela, a wraz z mądrością, o którą tak skromnie prosił otrzymuje od Pana niezliczone bogactwo i potęgę."
    {:thread ["1Krl 2,1-12"
              "1Krl 3,1-15"
              "1Krl 5-7"
              "1Krl 9,1-9"
              "1Krl 11,1-13"]
     :spine ["1Krl 1-5"
             "1Krl 6-11"
             "2Krn 1-4"]}]

   ["Podział i upadek północnego królestwa"
    "Miasta bogaciły się i rozrastały. Już w chwili śmierci Salomona widać było, że rozwój materialny destrukcyjnie wpływał na rozwój duchowy. W Izraelu na dobre rozgościł się politeizm, zapominano o przymierzu. Tak jak zapowiedział Bóg Salomonowi doszło do buntu a podział królestwa stał się faktem."
    {:thread ["1Krl 11,9-43"
              "1Krl 12"
              "2Krl 17,1-6"]
     :spine ["1Krl 13,1-10"
             "1Krl 15,25-16,28"
             "2Krn 10-12"
             "2Krl 17"]}]])

(defn create-step [data]
  {:id (str/lower-case (str/replace (first data) " " "-"))
   :title (first data)
   :introduction (second data)})

(defn create-items [step-id passages path-type counter]
  (map (fn [passage]
         (assoc {:id (str step-id "-" counter)
                 :stepId step-id
                 :path path-type
                 :passages passage}
                :id (str step-id "-" (swap! counter inc))))
       passages))

(defn process-input [input-data]
  (let [steps (mapv create-step input-data)
        counter (atom 1)
        items (mapcat (fn [[title _ {:keys [thread spine]}]]
                        (let [step-id (str/lower-case (str/replace title " " "-"))]
                          (concat (create-items step-id thread "Nić przewodnia" counter)
                                  (create-items step-id spine "Kręgosłup" counter))))
                      input-data)]
    {:steps steps :items items}))


(defn write-json [data file-path]
  (with-open [writer (io/writer file-path)]
    (json/generate-stream data writer)))

(defn -main []
  (let [parsed-data (process-input input-data)
        json-file-path "biblical_passages.json"]
    (write-json parsed-data json-file-path)
    (println "File saved to" json-file-path)))


(comment
  (-main)
  :end )