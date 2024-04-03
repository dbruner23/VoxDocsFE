import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import Api from "../../data/docs/Api";
import { authenticate } from "../../services/ApiHandler";
import styled from "@emotion/styled";

const TitleText = styled(Typography)({
  color: "white",
  textShadow: "2px 2px 8px rgba(0, 0, 0, 0.6)", // Adds shadow to the text
});

const StyledTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#365b80",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#365b80",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#365b80",
    },
  },
});

const Login = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Starting cloud server...");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await authenticate(password);
      if (response?.status === 200) {
        sessionStorage.setItem("userPassword", password);
        Api.setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Error authenticating", error);
      window.alert(error);
    }
    setIsLoading(false);
    setPassword("");
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isLoading) {
      timeout = setTimeout(() => {
        setLoadingText("Still starting... Sorry for the wait.");
      }, 30000);
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);

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
      <div
        className={"passwordContainer"}
        style={{
          display: "flex",
          width: "100%",
          gap: "1rem",
          justifyContent: "center",
          height: "3.5rem",
        }}
      >
        {isLoading ? (
          <React.Fragment>
            <CircularProgress size={24} sx={{ color: "white " }} />
            <TitleText variant="h5" sx={{ color: "white" }}>
              {loadingText}
            </TitleText>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <StyledTextField
              label="Please enter a password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2, width: "25rem" }}
            />
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              type="submit"
              sx={{ bgcolor: "#365b80" }}
            >
              Submit
            </Button>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
};

export default Login;
