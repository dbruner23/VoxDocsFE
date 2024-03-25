import { DocsActions } from "./Reducer";
import store from "../../services/Store";
import { getFileTypeFromExtension } from "../utils/DocsUtils";
import { process, docQuery } from "../../services/ApiHandler";

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
    const response = await process(file, fileType);
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
    debugger;
    if (chatResponse[0] && chatResponse[0].answer) {
      const chatResponseData = JSON.parse(chatResponse[0].answer);
      if (typeof chatResponseData.answer === "string") {
        chatHistory.push({ aiResp: chatResponseData });
      } else {
        chatHistory.push({ aiResp: chatResponseData });
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
};

export default Api;
