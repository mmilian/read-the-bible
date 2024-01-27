(ns user
  (:require [babashka.http-client :as http]
            [cheshire.core :as json]
            [clojure.java.io :as io]
            [clojure.pprint :as pprint :refer [pprint]]
            [clojure.string :as str]))

(def input-data
  [["Abraham" "Historia biblijna zaczyna się od Abrahama. Niezwykły człowiek wiary i modlitwy, pierwszy z patriarchów. Bezgranicznie zaufał Bogu, który niejednokrotnie do niego przemawiał. Sędziwy Abraham nazywany jest ojcem narodów."
    {:thread ["Rdz 12-13"
              "Rdz 18,1-15"
              "Rdz 21,1-8"]
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

(defn- create-step [data]
  {:id (str/lower-case (str/replace (first data) " " "-"))
   :title (first data)
   :introduction (second data)})

(defn- create-items [step-id passages path-type counter]
  (mapv (fn [passage]
          (assoc {:id (str step-id "-" counter)
                  :stepId step-id
                  :path path-type
                  :passages passage}
                 :id (str step-id "-" (swap! counter inc))))
        passages))

(defn parse-book-input [input-data]
  (let [steps (mapv create-step input-data)
        counter (atom 1)
        items (mapcat (fn [[title _ {:keys [thread spine]}]]
                        (let [step-id (str/lower-case (str/replace title " " "-"))]
                          (concat (create-items step-id thread "Nić przewodnia" counter)
                                  (create-items step-id spine "Kręgosłup" counter))))
                      input-data)]
    {:steps steps :items items}))

(comment
  (pprint/pprint (parse-book-input input-data))

;; output
;; {:id "saul-50",
;;  :stepId "saul",
;;  :path "Nić przewodnia",
;;  :passages "1Sm 13"} 

  :end)




(defn write-json [data file-path]
  (with-open [writer (io/writer file-path)]
    (json/generate-stream data writer)))


(defn read-json [file-path]
  (with-open [reader (io/reader file-path)]
    (doall (json/parse-stream reader true))))



(defn -main []
  (let [parsed-data (parse-book-input input-data)
        json-file-path "biblical_passages.json"]
    (write-json parsed-data json-file-path)
    (println "File saved to" json-file-path)))

(comment
  (-main)
  :end)

(defn- extract-items [[from to]]
  (let [from (Integer/parseInt from)
        to (when to (Integer/parseInt to))]
    (if (nil? to)
      [from]
      (into [] (range from (inc to))))))


;; extract from passages "Rdz 12-14" :book "Rdz" :chapters [12 13 14]
(defn extract-book-chapters [passage]
  (let
   [book-chapters (str/split passage #" ")]
    {:book (first book-chapters)
     :chapters (let [chapter-and-verses (second book-chapters)
                     [chapter verses] (str/split chapter-and-verses #",")]
                 (if (nil? verses)
                   (->
                    (str/split chapter #"-")
                    (extract-items))
                   [{:chapter (Integer/parseInt chapter) :verses (extract-items (str/split verses #"-"))}]))}))


(comment

  (extract-book-chapters "Rdz 12")
  (extract-book-chapters "Rdz 13-18")
  (extract-book-chapters "Rdz 13,1-18")

  (pprint/pprint
   (->> (parse-book-input input-data)
        :items
        (map :passages)
        (map extract-book-chapters)))

  :end
  )

(defn extract-singles [items]
  (->> items
       (map :passages)
       (map extract-book-chapters)))

(comment
  (-> (parse-book-input input-data)
      :items
      (extract-singles))
  :end)


(defn fetch-chapter [book chapter]
  (let [url (str "https://www.biblia.info.pl/api/biblia/bt/" book "/" chapter)]
    (println "Fetching" url)
    (->
     (http/get url)
     :body
     (json/parse-string true))))

(comment
  (def chapter (fetch-chapter "Rdz" "12"))
  (pprint chapter)
  (-> chapter  :verses)

  :end)

;; write code to replace polish characters with english ones
(defn polish-to-english [text]
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


(defn polish-to-english-2 [text]
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

(defn fetch-single [single]
  (let [book (polish-to-english (single :book))
        chapters (single :chapters)]
    (->> chapters
         (map (fn [chapter]
                (fetch-chapter book
                               (if (int? chapter)
                                 (str chapter)
                                 (:chapter chapter))))))))

(comment
  (pprint/pprint (fetch-single {:book "Rdz" :chapters [12]}))
  (pprint/pprint (fetch-single {:book "Rdz" :chapters [12 13]}))
  (pprint/pprint (fetch-single {:book "Rdz", :chapters [{:chapter 13, :verses [1 2]}]})))


(defn fetch-all [items]
  (->> items
       (mapv :passages)
       (mapv extract-book-chapters)
       (mapv fetch-single)
       (flatten)
       (doall)))

(comment

  (def bible (fetch-all (-> (parse-book-input input-data) :items)))

  (pprint (first bible))
  (write-json bible "all.json")
  (read-json "all.json")


  :end)


(defn to-verses [book]
  (->> book
       :verses
       (map (fn [verse]
              {:verse (Integer/parseInt (verse :verse))
               :text (verse :text)}))))

(defn to-book-verse [item]
  (println "to-book-verse")
  {:bibleAbbr (get-in item [:bible :abbreviation])
   :bibleName (get-in item [:bible :name])
   :bookAbbr (get-in item [:book :abbreviation])
   :bookName (get-in item [:book :name])
   :chapter (get-in item [:chapter])
   :verses (mapv (fn [verse]
                   {:bookAbbr (get-in item [:book :abbreviation])
                    :chapter (get-in item [:chapter])
                    :verse (Integer/parseInt (verse :verse))
                    :text (verse :text)}) (get-in item [:verses]))})


(defn chapter-2-verse-view
  "Return vec containing all flatten verses from given part of the bible "
  [bible]
  (->> bible
       (mapv to-book-verse)
       (mapv :verses)
       (reduce concat)
       (into [])))


(comment

  (def book
    {:bible {:abbreviation "bt", :name "Biblia Tysiąclecia"},
     :book {:abbreviation "rdz", :name "Księga Rodzaju"},
     :chapter 12,
     :type "Wersety",
     :verses
     [{:text
       "Pan rzekł do Abrama: Wyjdź z twojej ziemi rodzinnej i z domu twego ojca do kraju,  który ci ukażę.",
       :verse "1"}
      {:text
       "Uczynię bowiem z ciebie wielki naród,  będę ci błogosławił i twoje imię rozsławię: staniesz się błogosławieństwem.",
       :verse "2"}
      {:text
       "Będę błogosławił tym,  którzy ciebie błogosławić będą,  a tym,  którzy tobie będą złorzeczyli,  i ja będę złorzeczył. Przez ciebie będą otrzymywały błogosławieństwo ludy całej ziemi.",
       :verse "3"}],
     :verses_range "1-20"})


  (->
   (read-json "all.json")
   (chapter-2-verse-view)
   (set)
   (write-json "all-verses.json"))
  
  
  :end)

(comment

  (def verses (read-json "all-verses.json"))

  (def doubles
    (->> verses
         (group-by (juxt :verse :chapter :bookAbbr))
         (filter (fn [[k v]] (> (count v) 1)))))
  
  (first doubles)


  :end
  )



