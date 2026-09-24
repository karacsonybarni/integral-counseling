import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource-variable/manrope";
import "@fontsource-variable/lora";
import "@fontsource-variable/lora/wght-italic.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
