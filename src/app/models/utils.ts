export type Chapter = {
    nr: number;
    verses: number[];
  };
  
  
  type Book = {
    name: string;
    chapters: Chapter[];
  }
  

  
  export function extractBookChapters(passage: string): Book | undefined {
    console.log("Decoded", decodeURIComponent(passage));
    const [bookAndChapter, versesStr] = decodeURIComponent(passage).split(",");
    console.log("bookAndChapter: ", bookAndChapter,  " verses: ", versesStr);
    const [book, chaptersStr] = bookAndChapter.split(" ");
    console.log("book " ,book, " chapter: ", chaptersStr);
    const chapters = chaptersStr.split("-");
  console.log("chapters", chapters);    
    if (versesStr === undefined) {
      return {
        name: book.toLowerCase(),
        chapters: chapters.map((chapter) => {
          return {
            nr: parseInt(chapter, 10),
            verses: []
          }
        }),
      };
    } else {
      const verses = versesStr.split("-");
      return {
        name: book.toLowerCase(),
        chapters: [
          {
            nr: parseInt(chapters[0], 10),
            verses: verses.map((verse) => parseInt(verse, 10))
          }
        ]
      }
    }
  };