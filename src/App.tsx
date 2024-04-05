import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./services/Store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import VoxDocsLanding from "./views/VoxDoxLanding";
import SplitScreenWithChat from "./views/SplitScreen/SplitScreenDocChat";
import Api from "./data/docs/Api";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VoxDocsLanding />} />
          <Route path="/chat" element={<SplitScreenWithChat />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
