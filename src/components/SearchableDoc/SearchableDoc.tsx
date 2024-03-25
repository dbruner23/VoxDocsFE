import React, { useState, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useSelector } from "react-redux";
import { currentFileUrlState } from "../../data/docs/Reducer";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Styles from "./SearchableDoc.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// function highlightPattern(text: any, pattern: string) {
//   return text.replace(pattern, (value: any) => `<mark>${value}</mark>`);
// }

function highlightPattern(text: string, pattern: string) {
  // Create a dynamic regex that ignores extra whitespace in the search pattern
  const regexPattern = pattern.trim().split(/\s+/).join("\\s+");
  const regex = new RegExp(`(${regexPattern})`, "gi");
  return text.replace(regex, (match) => `<mark>${match}</mark>`);
}

function SearchablePDF() {
  const pdfFileUrl = useSelector(currentFileUrlState);
  const [text, setText] = useState("");
  const [searchQuery, setSearchQuery] = useState("Dear Dave and     session");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [matchingPages, setMatchingPages] = useState<any[]>([]);
  const [currentPageInput, setCurrentPageInput] = useState(pageNumber);

  const textRenderer = useCallback(
    (textItem: any) => highlightPattern(textItem.str, searchQuery),
    [searchQuery]
  );

  const handleCurrentPageInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPageNumber = parseInt(e.target.value);
    if (newPageNumber >= 1 && newPageNumber <= totalPages) {
      setCurrentPageInput(newPageNumber);
    }
  };

  const handleCurrentPageInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      setPageNumber(currentPageInput);
    }
  };

  useEffect(() => {
    if (pdfFileUrl) {
      pdfjs.getDocument(pdfFileUrl).promise.then((doc: any) => {
        let textContent = "";
        const pageMatches = new Array(doc.numPages).fill(false);
        setTotalPages(doc.numPages);
        for (let i = 1; i <= doc.numPages; i++) {
          doc.getPage(i).then((page: any) => {
            page.getTextContent().then((content: any) => {
              textContent += content.items
                .map((item: any) => item.str)
                .join(" ");
              // if (
              //   content.items.some((item: any) =>
              //     item.str
              //       .replace(/\s/g, "")
              //       .toLowerCase()
              //       .includes(searchQuery.replace(/\s/g, "").toLowerCase())
              //   )
              const searchRegex = new RegExp(
                searchQuery.trim().split(/\s+/).join("\\s+"),
                "i"
              );
              if (
                content.items.some((item: any) => searchRegex.test(item.str))
              ) {
                pageMatches[i - 1] = true; // Page contains a match
              }
            });
          });
        }
        setText(textContent);
        setMatchingPages(pageMatches);
      });
    }
  }, [pdfFileUrl, searchQuery]);

  useEffect(() => {
    // Update page number when the search query changes
    if (searchQuery && matchingPages.length > 0) {
      const firstMatchingPage =
        matchingPages.findIndex((isMatch) => isMatch) + 1;
      setPageNumber(firstMatchingPage);
    } else {
      setPageNumber(1); // Reset to the first page if the search has no results
    }
  }, [searchQuery, matchingPages]);

  return (
    <div className={Styles.documentContainer}>
      {/* <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      /> */}
      <div style={{ height: "95vh", overflow: "auto" }}>
        <Document file={pdfFileUrl}>
          {/* Render pages with potential search highlighting */}
          <Page pageNumber={pageNumber} customTextRenderer={textRenderer} />
        </Document>
      </div>
      <div
        style={{
          display: "flex",
          backgroundColor: "transparent",
          justifyContent: "center",
          marginTop: "1rem",
          zIndex: 20,
          bottom: "0px",
        }}
      >
        <button
          disabled={pageNumber === 1}
          onClick={() => {
            setPageNumber(pageNumber - 1);
            setCurrentPageInput(pageNumber - 1);
          }}
        >
          Previous
        </button>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={currentPageInput}
          onChange={handleCurrentPageInputChange}
          onKeyDown={handleCurrentPageInputKeyDown}
          style={{ margin: "0 1rem" }}
        />
        <button
          disabled={pageNumber === totalPages}
          onClick={() => {
            setPageNumber(pageNumber + 1);
            setCurrentPageInput(pageNumber + 1);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default SearchablePDF;
