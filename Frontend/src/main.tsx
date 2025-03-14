import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store"; // Ensure correct store import
import App from "./App";
import "./styles/app.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />  {/* This is required as 'children' */}
    </Provider>
  </React.StrictMode>
);
