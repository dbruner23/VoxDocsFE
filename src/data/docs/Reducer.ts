import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./State";
import { IProcessedDocument } from "./Interfaces";

const DocsSlice = createSlice({
  name: "docs",
  initialState,
  reducers: {
    setProcessedDocument: (
      state,
      action: PayloadAction<IProcessedDocument[] | null>
    ) => {
      state.processedDocument = action.payload;
    },
    setIsProcessingDocument: (state, action: PayloadAction<boolean>) => {
      state.isProcessingDocument = action.payload;
    },
    loadCurrentChatResponse(state, action: PayloadAction<any>) {
      state.currentChatResponse = action.payload;
    },
    setIsLoadingChatResponse(state, action: PayloadAction<boolean>) {
      state.isLoadingChatResponse = action.payload;
    },
    setCurrenFileUrl: (state, action: PayloadAction<string | null>) => {
      state.currentFileUrl = action.payload;
    },
  },
});

export const DocsActions = DocsSlice.actions;

export const processedDocumentState = (state: any) =>
  state.docs.processedDocument;
export const isProcessingDocumentState = (state: any): boolean =>
  state.docs.isProcessingDocument;
export const isLoadingChatResponseState = (state: any): boolean =>
  state.docs.isLoadingChatResponse;
export const currentChatResponseState = (state: any): string | null =>
  state.docs.currentChatResponse;
export const currentFileUrlState = (state: any): string | null =>
  state.docs.currentFileUrl;

export default DocsSlice.reducer;
