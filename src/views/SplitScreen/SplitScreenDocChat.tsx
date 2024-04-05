import React, { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { processedDocumentState } from "../../data/docs/Reducer";
import Styles from "./SplitScreenDocChat.module.css";
import { IProcessedDocument } from "../../data/docs/Interfaces";
import { highlightText } from "../../utils/documentUtils";
import ChatUI from "../../components/ChatUI/ChatUI";
import SearchableDoc from "../../components/SearchableDoc/SearchableDoc";
import { useNavigate } from "react-router-dom";
import Api from "../../data/docs/Api";

const boxStyle = {
  display: "flex",
  justifyContent: "center",
  flex: 1,
  backgroundColor: "black",
  border: "1px solid #ccc",
  zIndex: 10,
  height: "100vh",
  width: "50vw",
};

const SplitScreenWithChat = () => {
  const fileContent = useSelector(processedDocumentState);
  const containerRef = useRef(null);
  const [highlightedString, setHighlightedString] = useState("");
  const navigate = useNavigate();

  const handleUnload = async (event: any) => {
    event.preventDefault();
    const response = await Api.clearAllDocs();
    console.log(response);
    navigate("/");
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  useEffect(() => {
    // Scroll to the first highlighted element
    if (highlightedString) {
      const highlightedElement = (
        containerRef.current as unknown as HTMLElement
      )?.querySelector(".highlight");
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [highlightedString]);

  return (
    <div className={Styles.container}>
      <Box sx={boxStyle}>
        <SearchableDoc />
      </Box>
      <Box sx={boxStyle}>
        <ChatUI />
      </Box>
    </div>
  );
};

export default SplitScreenWithChat;
