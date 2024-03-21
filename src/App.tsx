import React from "react";
import { Provider } from "react-redux";
import store from "./services/Store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import VoxDocsLanding from "./views/VoxDoxLanding";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VoxDocsLanding />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
