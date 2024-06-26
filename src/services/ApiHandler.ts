import axios from "axios";

const api = axios.create({
  baseURL: "https://voxdoxbe.onrender.com",
});

export const authenticate = async (password: string) => {
  const username = process.env.REACT_APP_USERNAME;

  try {
    const response = await api.post("/auth", { username, password });
    return response;
  } catch (error: any) {
    console.error("Authentication failed:", error);
    window.alert("Invalid password");
  }
};

export const processFile = async (
  file: File,
  fileType: "csv" | "pdf" | "html" | "markdown"
) => {
  try {
    const username = process.env.REACT_APP_USERNAME;
    const password = sessionStorage.getItem("userPassword");
    const encodedCredentials = btoa(`${username}:${password}`);

    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("fileType", fileType);

    const response = await api.post("/process", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Basic ${encodedCredentials}`,
      },
    });

    return response;
  } catch (error) {
    console.error("File processing error:", error);
    alert("File processing error");
  }
};

export const docQuery = async (body: any) => {
  try {
    const username = process.env.REACT_APP_USERNAME;
    const password = sessionStorage.getItem("userPassword");
    const encodedCredentials = btoa(`${username}:${password}`);

    const response = await api.post("/docquery", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedCredentials}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error:", error);
    window.alert(error.response.data);
    return null;
  }
};

export const clearAllFiles = async () => {
  try {
    const username = process.env.REACT_APP_USERNAME;
    const password = sessionStorage.getItem("userPassword");
    const encodedCredentials = btoa(`${username}:${password}`);

    const response = await api.get("/delete", {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    });

    return response;
  } catch (error: any) {
    console.error("Error clearing files:", error);
    window.alert("Error clearing files");
  }
};
