import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/**
 * Application entry point
 * Initializes React root and renders the main App component
 * 
 * @function
 * @returns {void}
 */
createRoot(document.getElementById("root")!).render(<App />);
