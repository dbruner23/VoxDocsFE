import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
});

export const process = async (
  file: File,
  fileType: "csv" | "pdf" | "html" | "markdown"
) => {
  try {
    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("fileType", fileType);

    const response = await api.post("/process", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error("File processing error:", error);
    alert("File processing error");
  }
};

export const chatPromptResponse = async (body: any) => {
  try {
    // const username = process.env.REACT_APP_USERNAME;
    // const password = sessionStorage.getItem("userPassword");
    // const encodedCredentials = btoa(`${username}:${password}`);

    const response = await api.post("/geopt/flights", body, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Basic ${encodedCredentials}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error:", error);
    window.alert(error.response.data);
    return null;
  }
};
