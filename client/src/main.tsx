import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import Footer from "./components/ui/Footer.tsx";
import Header from "./components/ui/Header.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Header />
                <App />
                <Footer />
                <Toaster position="top-right" />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
