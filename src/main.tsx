import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Providers } from "./providers";
import App from "./App";
import "./index.css";

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);
