import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  IconButton,
  SvgIcon,
  TextField,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import Styles from "./ChatUI.module.css";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Api from "../../data/docs/Api";
import {
  chatHistoryState,
  isLoadingChatResponseState,
} from "../../data/docs/Reducer";
import { useSelector } from "react-redux";
import { cleanText, truncateText } from "../../data/utils/DocsUtils";

const introText =
  "Ask any question about the loaded document. You can also ask to summarize the entire document or parts of it.";

const ChatUI = () => {
  const isLoadingChatResponse = useSelector(isLoadingChatResponseState);
  const currentChatHistory = useSelector(chatHistoryState);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const latestMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChatHistory]);

  const handleSubmit = () => {
    if (canSubmit) {
      const chatHistory = [...currentChatHistory];
      chatHistory.push({ human: userPrompt });
      Api.setCurrentChatHistory(chatHistory);
      const body = JSON.stringify({ question: userPrompt });
      try {
        Api.documentQuery(body);
      } catch (error) {
        console.error("Error getting GeoPT response", error);
        window.alert(error);
      }
    }
    setUserPrompt("");
    setCanSubmit(false);
  };

  return (
    <div className={Styles.chatUiContainer}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent:
            currentChatHistory.length === 0 ? "center" : "flex-start",
          alignItems: "flex-start",
          gap: "3rem",
          margin: "2rem",
          backgroundColor: "#000000",
          height: "100%",
          zIndex: 1000,
          color: "#ffffff",
          overflowY: "auto",
        }}
      >
        {currentChatHistory.length === 0
          ? introText
          : currentChatHistory.map((message, index) => {
              let answerText = null;
              let fullAnswer: any = null;
              if (message.aiResp && !message.aiResp.answer[0].answer) {
                answerText = message.aiResp.answer;
              } else if (message.aiResp && message.aiResp.answer[0].answer) {
                fullAnswer = message.aiResp;
                answerText = message.aiResp.answer[0].answer;
              }

              const isLatestMessage = index === currentChatHistory.length - 1;

              return (
                <div
                  key={index}
                  ref={isLatestMessage ? latestMessageRef : null}
                >
                  {message.human && (
                    <div className={Styles.chatElement}>
                      <div>
                        <strong>You:</strong>
                      </div>
                      <div>{message.human}</div>
                    </div>
                  )}
                  {message.aiResp && (
                    <div className={Styles.chatElement}>
                      <div>
                        <strong>Assistant:</strong>
                      </div>
                      <div>{answerText}</div>
                      {fullAnswer && (
                        <div>
                          {fullAnswer.answer[0].citations.map(
                            (value: number, index: number) => {
                              const cleanedText = cleanText(
                                fullAnswer.context[value].page_content
                              );
                              return (
                                <Button
                                  key={index}
                                  variant="outlined"
                                  sx={{
                                    margin: "5px",
                                    padding: "2px 5px",
                                    minWidth: "fit-content",
                                    textTransform: "none",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    width: "95%", // Take up the full width of the container
                                    display: "block", // Ensure it's treated as a block element to fill the width
                                  }}
                                  // style={{
                                  //   margin: "5px",
                                  //   padding: "2px 5px",
                                  //   minWidth: "fit-content",
                                  //   textTransform: "none",
                                  // }}
                                  onClick={() => {
                                    const cleanedText = cleanText(
                                      fullAnswer.context[value].page_content
                                    );
                                    Api.setCurrentCitationText(cleanedText);
                                  }}
                                >
                                  {index + 1}.
                                  {truncateText(
                                    cleanText(
                                      fullAnswer.context[value].page_content
                                    ),
                                    80
                                  )}
                                </Button>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
      </Box>
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
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "transparent", // Remove default border color
              },
              "&:hover fieldset": {
                borderColor: "transparent", // Remove border color on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "transparent", // Remove border color when focused
              },
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
            <CircularProgress size={24} style={{ color: "white" }} /> // Display spinner when loading
          ) : (
            <ArrowUpwardIcon style={{ color: "white" }} /> // Otherwise display the arrow icon
          )}
        </IconButton>
      </div>
    </div>
  );
};

export default ChatUI;
