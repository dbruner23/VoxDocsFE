import React, { useState } from "react";
import { Box } from "@mui/material";
import surfaceImage from "../assets/surface.jpeg";
import Upload from "../components/Upload/Upload";
import SplitScreenWithChat from "../components/SplitScreen/SplitScreenDocChat";
import { useSelector } from "react-redux";
import {
  isProcessingDocumentState,
  processedDocumentState,
} from "../data/docs/Reducer";
import { CircularProgress } from "@mui/material";
import _isNil from "lodash/isNil";

function VoxDocsLanding() {
  const isProcessingDocument = useSelector(isProcessingDocumentState);
  const fileContent = useSelector(processedDocumentState);

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
      ) : fileContent === null ? (
        <Upload />
      ) : (
        <SplitScreenWithChat />
      )}
    </Box>
  );
}

export default VoxDocsLanding;
