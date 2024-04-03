import { IProcessedDocument } from "./Interfaces";

export interface IDocsState {
  processedDocument: IProcessedDocument[] | null;
  isProcessingDocument: boolean;
  isLoadingChatResponse: boolean;
  currentChatResponse: string | null;
  currentFileUrl: string | null;
  chatHistory: any[];
  currentCitationText: string;
  isLoggedIn: boolean;
}

export const initialState: IDocsState = {
  processedDocument: null,
  isProcessingDocument: false,
  isLoadingChatResponse: false,
  currentChatResponse: null,
  currentFileUrl: null,
  chatHistory: [],
  currentCitationText: "",
  isLoggedIn: false,
};
