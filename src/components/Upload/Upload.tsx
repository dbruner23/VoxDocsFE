import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Api from "../../data/docs/Api";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styled from "@emotion/styled";

const TitleText = styled(Typography)({
  color: "white",
  textShadow: "2px 2px 8px rgba(0, 0, 0, 0.6)", // Adds shadow to the text
});

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      await Api.setCurrentFileUrl(fileUrl);
      setIsFileUploaded(true);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setIsFileUploaded(false);
  };

  const handleProcess = () => {
    if (selectedFile) {
      Api.processFile(selectedFile);
      Api.setIsProcessingDocument(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
        mb: 2,
        gap: "2rem",
      }}
    >
      <TitleText variant="h3" gutterBottom>
        VoxDocs
      </TitleText>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        Efficiently surface key insights from any document.
      </Typography>
      {isFileUploaded ? (
        <>
          <Box sx={{ display: "flex", alignItems: "center", color: "green" }}>
            <CheckCircleIcon sx={{ marginRight: "0.5rem" }} />
            <Typography variant="subtitle1">
              File Uploaded Successfully!
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Button
              onClick={handleProcess}
              variant="contained"
              size="large"
              sx={{ maxWidth: "20rem", backgroundColor: "green" }}
            >
              Process
            </Button>
            <Button
              onClick={handleCancel}
              variant="contained"
              size="large"
              sx={{ maxWidth: "20rem", backgroundColor: "darkred" }}
            >
              Cancel
            </Button>
          </Box>
        </>
      ) : (
        <Button
          variant="contained"
          size="large"
          component="label"
          sx={{ maxWidth: "20rem" }}
        >
          Upload a File
          <input
            type="file"
            accept=".csv,.json,.html,.md,.pdf"
            hidden
            onChange={handleFileUpload}
          />
        </Button>
      )}
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Upload any pdf, html, md, csv, or json file and click "Process" to
        interact with its content in natural language through LLM-enabled chat
        with citations.
      </Typography>
    </Box>
  );
};

export default Upload;
