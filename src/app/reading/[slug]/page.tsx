"use client"
import { useEffect, useState } from "react";
import { Verse, db } from "../../models/db";
import { extractBookChapters } from "../../models/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';


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

function verseRange(verses: number[]): [number, number] {
  return [verses[0], verses[verses.length - 1]];
}


export default function Page({ params }: { params: { slug: string } }) {
  const [verses, setVerses] = useState<[string, Verse[]][]>([]);
  const slug = params.slug;

  useEffect(() => {
    const book = extractBookChapters(params.slug);
    console.log("Use efect book", book)
    if (book === undefined) {
      console.log("Book is undefined", book)
      return;
    }
    const fetchVerses = async () => {
      if (book.chapters.length === 1) {
        const chapter = book.chapters[0];
        const verseArr = await db.verses.where(["bookAbbr", "chapter", "verse"])
          .between([book.name, chapter.nr, chapter.verses[0]], [book.name, chapter.nr, chapter.verses[1]], true, true).toArray();
        console.log("verseArr", verseArr)
        const sorstedVerseArr = groupBy(verseArr, "chapter")
        const chapterVerse = Object.entries(sorstedVerseArr).sort(([keyA], [keyB]) => parseInt(keyA) - parseInt(keyB))
        setVerses(chapterVerse);
      } else {
        const from = book.chapters[0];
        const to = book.chapters[1];
        const verseArr = await db.verses.where(["bookAbbr", "chapter"])
          .between([book.name, from.nr], [book.name, to.nr], true, true).toArray();
        console.log("verseArr", verseArr)
        const sorstedVerseArr = groupBy(verseArr, "chapter")
        const chapterVerse = Object.entries(sorstedVerseArr).sort(([keyA], [keyB]) => parseInt(keyA) - parseInt(keyB))
        setVerses(chapterVerse);
      }
    };
    fetchVerses();
  }, [params.slug]);

  // iterate over verses

  return (
    <div>
      <Link href={`/`} style={{
        display: "inline-block",
        padding: "5px 5px",
        textDecoration: "none",
        backgroundColor: "transparent",
        border: "none",
        fontSize: "30px",
      }}>
       <FontAwesomeIcon icon={faArrowLeft} /> 
      </Link>
      <h1>{decodeURIComponent(slug)}</h1>
      {verses.map((chapterVerse, index) => (
        <div key={index}>
          <h2>{chapterVerse[0]}</h2>
          {chapterVerse[1].map((verse, index) => (
            <p key={index}>{verse.verse} {verse.text}</p>
          ))}
        </div>
      ))}
    </div>
  );
}