import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App.tsx";
import Footer from "./components/ui/Footer.tsx";
import Header from "./components/ui/Header.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Header signup={{ title: "Sign Up", href: "#" }} />
        <App />
        <Footer>&copy; 2026 by Phillip Cantu. All Rights Reserved.</Footer>
        <Toaster position="top-right" />
    </StrictMode>
);
