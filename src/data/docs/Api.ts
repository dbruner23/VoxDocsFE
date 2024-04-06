import { DocsActions } from "./Reducer";
import store from "../../services/Store";
import { getFileTypeFromExtension, isJsonString } from "../utils/DocsUtils";
import {
  processFile,
  docQuery,
  clearAllFiles,
} from "../../services/ApiHandler";

const Api = {
  setCurrentFileUrl: (url: string | null) => {
    store.dispatch(DocsActions.setCurrenFileUrl(url));
  },
  processFile: async (file: File) => {
    const fileType = getFileTypeFromExtension(file);
    if (!fileType) {
      alert("Invalid file type");
      return;
    }
    const response = await processFile(file, fileType);
    console.log(response);
    if (response?.data) {
      store.dispatch(DocsActions.setProcessedDocument(response?.data));
      Api.setIsProcessingDocument(false);
    }
  },
  setIsProcessingDocument: (isProcessing: boolean) => {
    store.dispatch(DocsActions.setIsProcessingDocument(isProcessing));
  },
  setIsLoadingChatResponse: (isLoading: boolean) => {
    store.dispatch(DocsActions.setIsLoadingChatResponse(isLoading));
  },
  documentQuery: async (body: any) => {
    Api.setIsLoadingChatResponse(true);
    const chatResponse = await docQuery(body);

    if (chatResponse === null) {
      Api.setIsLoadingChatResponse(false);
      return;
    }

    const currentChatHistory = store.getState().docs.chatHistory;
    const chatHistory = [...currentChatHistory];
    if (chatResponse[0] && chatResponse[0].answer) {
      if (isJsonString(chatResponse[0].answer)) {
        const chatResponseData = JSON.parse(chatResponse[0].answer);
        chatHistory.push({ aiResp: chatResponseData });
      } else {
        chatHistory.push({ aiResp: chatResponse[0] });
      }
    }

    Api.setCurrentChatHistory(chatHistory);
    Api.setIsLoadingChatResponse(false);
  },
  setCurrentChatHistory: (chatHistory: any) => {
    store.dispatch(DocsActions.setChatHistory(chatHistory));
  },
  setCurrentCitationText: (text: string) => {
    store.dispatch(DocsActions.setCurrentCitationText(text));
  },
  setIsLoggedIn: (isLoggedIn: boolean) => {
    store.dispatch(DocsActions.setIsLoggedIn(isLoggedIn));
  },
  clearAllDocs: async () => {
    store.dispatch(DocsActions.setIsProcessingDocument(true));
    const response = await clearAllFiles();
    console.log(response);
    // remove current doc url
    store.dispatch(DocsActions.setCurrenFileUrl(null));
    store.dispatch(DocsActions.setProcessedDocument(null));
    store.dispatch(DocsActions.setChatHistory([]));
    store.dispatch(DocsActions.setCurrentCitationText(""));
    store.dispatch(DocsActions.setIsProcessingDocument(false));
  },
};

export default Api;
