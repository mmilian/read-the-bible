"use client";
import { useEffect, useState } from "react";
import { ReadingDB, Verse, db } from "../../models/db";
import { Chapter, extractBookChapters } from "../../models/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import NextLink  from "next/link";

type MapValuesToKeysIfAllowed<T> = {
  [K in keyof T]: T[K] extends PropertyKey ? K : never;
};

type Filter<T> = MapValuesToKeysIfAllowed<T>[keyof T];

function groupBy<T extends Record<PropertyKey, any>, Key extends Filter<T>>(
  arr: T[],
  key: Key
): Record<T[Key], T[]> {
  return arr.reduce((accumulator, val) => {
    const groupedKey = val[key];
    if (!accumulator[groupedKey]) {
      accumulator[groupedKey] = [];
    }
    accumulator[groupedKey].push(val);
    return accumulator;
  }, {} as Record<T[Key], T[]>);
}

const sortByChapterAndVerse = (verseArr: Verse[]) => {
  const sortedVerseArr = groupBy(verseArr, "chapter");
  return Object.entries(sortedVerseArr).sort(
    ([keyA], [keyB]) => parseInt(keyA) - parseInt(keyB)
  );
};

function verseRange(verses: number[]): [number, number] {
  return [verses[0], verses[verses.length - 1]];
}

async function fetchVerseRangeFromChapter(
  db: ReadingDB,
  bookName: string,
  chapter: number,
  verseFrom: number,
  verseTo: number
) {
  return db.verses
    .where(["bookAbbr", "chapter", "verse"])
    .between(
      [bookName, chapter, verseFrom],
      [bookName, chapter, verseTo],
      true,
      true
    )
    .toArray()
    .then((verseArr) => sortByChapterAndVerse(verseArr));
}

async function fetchChapters(
  db: ReadingDB,
  bookName: string,
  chapterFrom: number,
  chapterTo: number
) {
  return db.verses
    .where(["bookAbbr", "chapter"])
    .between([bookName, chapterFrom], [bookName, chapterTo], true, true)
    .toArray()
    .then((verseArr) => sortByChapterAndVerse(verseArr));
}

function isOneChapterWithVerses(chapters: Chapter[]) {
  return chapters.length === 1 && chapters[0].verses.length === 2;
}

function isWholeChapter(book: { name: string; chapters: Chapter[] }) {
  return book.chapters.length === 1 && book.chapters[0].verses.length === 0;
}

function areChapters(book: { name: string; chapters: Chapter[] }) {
  return book.chapters.length === 2;
}

export default function Page({ params }: { params: { slug: string } }) {
  const [verses, setVerses] = useState<[string, Verse[]][]>([]);
  const slug = params.slug;
  
  useEffect(() => {
    const book = extractBookChapters(slug[0]);
    console.log("Slug: ", slug[1])
    console.log("Use efect book", book);
    if (book === undefined) {
      console.log("Book is undefined", book);
      return;
    }
    const fetchVerses = async () => {
      let chapterWithVerses: [string, Verse[]][] = [];
      if (isOneChapterWithVerses(book.chapters)) {
        const chapter = book.chapters[0];
        chapterWithVerses = await fetchVerseRangeFromChapter(
          db,
          book.name,
          chapter.nr,
          chapter.verses[0],
          chapter.verses[1]
        );
      } else if (isWholeChapter(book)) {
        chapterWithVerses = await fetchChapters(
          db,
          book.name,
          book.chapters[0].nr,
          book.chapters[0].nr
        );
        setVerses(chapterWithVerses);
      } else if (areChapters(book)) {
        chapterWithVerses = await fetchChapters(
          db,
          book.name,
          book.chapters[0].nr,
          book.chapters[1].nr
        );
        setVerses(chapterWithVerses);
      } else
        console.log(
          "Not a expected state. Should be one chapter with verses or whole chapter or chapters"
        );
      setVerses(chapterWithVerses);
    };
    fetchVerses();
  }, [params.slug]);

  // iterate over verses

  return (
    <div>
      <header className="header">
        <h1>{decodeURIComponent(slug[0])}</h1>
        <NextLink href={`/#${slug[1]}`} className="btn" aria-label={slug[1]} scroll={true} title={slug[1]}>
          <FontAwesomeIcon icon={faArrowLeft} /> powrót
        </NextLink>
      </header>
      <div className="preview">
        <div className="card">
          {verses.map((chapterVerse, index) => (
            <div className="text" key={index}>
              <h2>{chapterVerse[0]}</h2>
              {chapterVerse[1].map((verse, index) => (
                <p key={index}>
                  {verse.verse} {verse.text}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
