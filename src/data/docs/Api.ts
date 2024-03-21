import { DocsActions } from "./Reducer";
import store from "../../services/Store";
import { getFileTypeFromExtension } from "../utils/DocsUtils";
import { process, chatPromptResponse } from "../../services/ApiHandler";

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
  getAndLoadChatResponse: async (body: any) => {
    Api.setIsLoadingChatResponse(true);
    const chatResponse = await chatPromptResponse(body);

    if (chatResponse === null) {
      Api.setIsLoadingChatResponse(false);
      return;
    }

    const chatResponseText = chatResponse.chat_response;
    store.dispatch(DocsActions.loadCurrentChatResponse(chatResponseText));
    Api.setIsLoadingChatResponse(false);
  },
};

export default Api;
