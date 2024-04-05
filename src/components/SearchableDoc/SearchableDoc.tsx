import React, { useState, useEffect, useCallback, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useSelector } from "react-redux";
import {
  currentCitationTextState,
  currentFileUrlState,
  isProcessingDocumentState,
} from "../../data/docs/Reducer";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Styles from "./SearchableDoc.module.css";
import { escapeRegExp, normalizeText } from "../../data/utils/DocsUtils";
import { Button } from "@mui/material";
import Api from "../../data/docs/Api";
import { useNavigate } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function highlightPattern(text: string, pattern: string) {
  const patternWords = pattern.split(/\s+/);
  let textIncludesPattern = false;

  // Generate all possible substrings of 4 consecutive words
  for (let i = 0; i < patternWords.length - 4; i++) {
    const substring = patternWords.slice(i, i + 5).join(" ");
    if (text.toLowerCase().includes(substring.toLowerCase())) {
      textIncludesPattern = true;
      break; // Exit the loop early if a match is found
    }
  }

  if (textIncludesPattern) {
    // If any part of the pattern is found within the text, wrap the entire line in <mark> tags
    return `<mark>${text}</mark>`;
  } else {
    // Return the text as is if the pattern is not found
    return text;
  }
  // const regexPattern = pattern.trim().split(/\s+/).join("[\\s\\S]*");
  // const regex = new RegExp(`(${regexPattern})`, "gi");
  // return text.replace(regex, (match) => `<mark>${match}</mark>`);
}

function SearchablePDF() {
  const pdfFileUrl = useSelector(currentFileUrlState);
  const currentCitationText = useSelector(currentCitationTextState);
  const isProcessingDocument = useSelector(isProcessingDocumentState);
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [matchingPages, setMatchingPages] = useState<any[]>([]);
  const [currentPageInput, setCurrentPageInput] = useState(pageNumber);

  const textRenderer = useCallback(
    (textItem: any) => highlightPattern(textItem.str, currentCitationText),
    [currentCitationText]
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

  const handleClearAll = async () => {
    await Api.clearAllDocs();
    navigate("/");
  };

  const findMatchingPages = async (
    pdfFileUrl: string,
    currentCitationText: string
  ) => {
    const doc = await pdfjs.getDocument(pdfFileUrl).promise;
    const pagePromises = [];

    for (let i = 1; i <= doc.numPages; i++) {
      const pagePromise = doc.getPage(i).then((page: any) => {
        return page.getTextContent().then((content: any) => {
          const contentText = content.items
            .map((item: any) => item.str)
            .join(" ");
          const firstTenWords = currentCitationText
            .split(/\s+/)
            .slice(0, 10)
            .join(" ");

          return normalizeText(contentText).includes(
            normalizeText(firstTenWords)
          );
        });
      });
      pagePromises.push(pagePromise);
    }

    const pageMatches = await Promise.all(pagePromises);
    setMatchingPages(pageMatches);
    const firstMatchingPage = pageMatches.findIndex((match) => match) + 1;
    if (firstMatchingPage > 0) {
      setPageNumber(firstMatchingPage);
      setCurrentPageInput(firstMatchingPage);
    } else {
      setPageNumber(1);
      setCurrentPageInput(1);
    }
  };

  useEffect(() => {
    if (pdfFileUrl) {
      pdfjs.getDocument(pdfFileUrl).promise.then((doc: any) => {
        setTotalPages(doc.numPages);
      });
    }
  }, [pdfFileUrl]);

  useEffect(() => {
    if (pdfFileUrl && currentCitationText) {
      findMatchingPages(pdfFileUrl, currentCitationText);
    }
  }, [pdfFileUrl, currentCitationText]);

  return (
    <div className={Styles.documentContainer}>
      <div style={{ height: "95vh", overflow: "auto" }}>
        <Document file={pdfFileUrl}>
          <Page pageNumber={pageNumber} customTextRenderer={textRenderer} />
        </Document>
      </div>
      <div
        style={{
          display: "flex",
          backgroundColor: "transparent",
          gap: "1rem",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "1rem",
          marginBottom: "1rem",
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
        />
        <span style={{ color: "white" }}>of {totalPages}</span>
        <button
          disabled={pageNumber === totalPages}
          onClick={() => {
            setPageNumber(pageNumber + 1);
            setCurrentPageInput(pageNumber + 1);
          }}
        >
          Next
        </button>
        <Button
          onClick={handleClearAll}
          variant="contained"
          disabled={isProcessingDocument}
        >
          Clear & Exit
        </Button>
      </div>
    </div>
  );
}

export default SearchablePDF;
