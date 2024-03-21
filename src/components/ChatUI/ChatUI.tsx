import React, { useState, useEffect } from "react";
import {
  IconButton,
  SvgIcon,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";
import Styles from "./ChatUI.module.css";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Api from "../../data/docs/Api";
import {
  currentChatResponseState,
  isLoadingChatResponseState,
} from "../../data/docs/Reducer";
import { useSelector } from "react-redux";

const introText =
  "Ask any question about the loaded document. You can also ask me to summarize the entire document, or parts of it.";

const ChatUI = () => {
  const isLoadingChatResponse = useSelector(isLoadingChatResponseState);
  const currentChatGeoPTResponse = useSelector(currentChatResponseState);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [displayedText, setDisplayedText] = useState(introText);
  const boxHeight = displayedText.length > 0 ? "auto" : "0px";

  const handleSubmit = () => {
    if (canSubmit) {
      const body = JSON.stringify({ prompt: userPrompt });
      try {
        Api.getAndLoadChatResponse(body);
      } catch (error) {
        console.error("Error getting GeoPT response", error);
        window.alert(error);
      }
    }
    setUserPrompt("");
    setCanSubmit(false);
  };

  useEffect(() => {
    if (isLoadingChatResponse) {
      setDisplayedText("");
    }

    if (currentChatGeoPTResponse) {
      setDisplayedText(currentChatGeoPTResponse);
    }
  }, [currentChatGeoPTResponse, isLoadingChatResponse]);

  return (
    <div className={Styles.chatUiContainer}>
      {displayedText.length > 0 && (
        <Box
          sx={{
            margin: "2rem",
            backgroundColor: "#000000",
            height: "100%",
            zIndex: 1000,
            color: "#ffffff",
            overflowY: "auto",
          }}
        >
          {displayedText}
        </Box>
      )}
      <div className={Styles.inputContainer}>
        <TextField
          className={Styles.promptInput}
          id="outlined-multiline-static"
          label="Chat Prompt"
          placeholder=""
          multiline
          value={userPrompt}
          sx={{
            backgroundColor: "#000000",
            zIndex: 1000,
            opacity: 0.9,
            width: "calc(100% - 3.5rem)",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            "& .MuiInputBase-input": {
              color: "#ffffff",
            },
            "& .MuiInputLabel-root": {
              color: "#ffffff",
            },
          }}
          onChange={(e) => {
            if (e.target.value.length > 0) {
              setCanSubmit(true);
            } else {
              setCanSubmit(false);
            }
            setUserPrompt(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSubmit) {
              handleSubmit();
              e.preventDefault(); // Prevents the addition of a new line in the TextField after pressing 'Enter'
            }
          }}
        />
        <IconButton
          disabled={!canSubmit}
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#000000",
            height: "3.5rem",
            width: "3.5rem",
            alignSelf: "flex-end",
            border: "1px solid lightgrey",
            borderRadius: "5px",
            zIndex: 1000,
            opacity: 0.9,
          }}
        >
          {isLoadingChatResponse ? (
            <CircularProgress size={24} style={{ color: "whit" }} /> // Display spinner when loading
          ) : (
            <ArrowUpwardIcon style={{ color: "white" }} /> // Otherwise display the arrow icon
          )}
        </IconButton>
      </div>
    </div>
  );
};

export default ChatUI;
