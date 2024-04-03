import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import surfaceImage from "../assets/surface.jpeg";
import Upload from "../components/Upload/Upload";
import SplitScreenWithChat from "./SplitScreen/SplitScreenDocChat";
import { useSelector } from "react-redux";
import {
  isLoggedInState,
  isProcessingDocumentState,
  processedDocumentState,
} from "../data/docs/Reducer";
import { CircularProgress } from "@mui/material";
import _isNil from "lodash/isNil";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login/Login";

function VoxDocsLanding() {
  const isLoggedIn = useSelector(isLoggedInState);
  const isProcessingDocument = useSelector(isProcessingDocumentState);
  const fileContent = useSelector(processedDocumentState);
  const navigate = useNavigate();

  useEffect(() => {
    if (!_isNil(fileContent)) {
      navigate("/chat");
    }
  }, [fileContent]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundImage: `url(${surfaceImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {isProcessingDocument ? (
        <CircularProgress />
      ) : isLoggedIn ? (
        <Upload />
      ) : (
        <Login />
      )}
    </Box>
  );
}

export default VoxDocsLanding;
