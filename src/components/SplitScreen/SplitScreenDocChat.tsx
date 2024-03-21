import React, { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { processedDocumentState } from "../../data/docs/Reducer";
import Styles from "./SplitScreenDocChat.module.css";
import { IProcessedDocument } from "../../data/docs/Interfaces";
import { highlightText } from "../../utils/documentUtils";
import ChatUI from "../ChatUI/ChatUI";
import SearchableDoc from "../SearchableDoc/SearchableDoc";

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
  const [conversation, setConversation] = useState([]);
  const [highlightedString, setHighlightedString] = useState("");

  //   const handleSendMessage = (message) => {
  //     setConversation([...conversation, message]);
  //   };
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
