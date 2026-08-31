import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Global image fallback: if any <img> fails to load, swap in the branded
// placeholder so the site never renders visibly broken.
const PLACEHOLDER = "/images/placeholder.svg";
document.addEventListener(
  "error",
  (event) => {
    const target = event.target as HTMLElement | null;
    if (!target || target.tagName !== "IMG") return;
    const img = target as HTMLImageElement;
    if (img.dataset.fallback === "true") return;
    img.dataset.fallback = "true";
    img.src = PLACEHOLDER;
    img.style.objectFit = "cover";
  },
  true,
);

createRoot(document.getElementById("root")!).render(<App />);
